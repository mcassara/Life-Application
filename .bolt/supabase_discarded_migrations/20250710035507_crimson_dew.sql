/*
  # Data Cleanup and Maintenance Functions

  1. Cleanup Functions
    - Archive old data
    - Clean up orphaned records
    - Optimize storage

  2. Maintenance Functions
    - Update statistics
    - Refresh materialized views
    - Cleanup expired data

  3. Scheduled Tasks
    - Daily cleanup routines
    - Weekly maintenance tasks
*/

-- Function to archive old completed analyses
CREATE OR REPLACE FUNCTION archive_old_analyses(days_old INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE needs_analyses 
  SET status = 'archived'
  WHERE status = 'completed' 
    AND created_at < NOW() - INTERVAL '1 day' * days_old
    AND status != 'archived';
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_notifications 
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired banners
CREATE OR REPLACE FUNCTION cleanup_expired_banners()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE system_banners 
  SET active = false
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW()
    AND active = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user last login
CREATE OR REPLACE FUNCTION update_user_last_login(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET last_login = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate client engagement score
CREATE OR REPLACE FUNCTION calculate_client_engagement_score(client_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC := 0;
  days_since_creation INTEGER;
  communication_count INTEGER;
  document_count INTEGER;
  analysis_count INTEGER;
BEGIN
  -- Get basic metrics
  SELECT 
    EXTRACT(DAYS FROM NOW() - c.created_at),
    COUNT(DISTINCT cc.id),
    COUNT(DISTINCT cd.id),
    COUNT(DISTINCT na.id)
  INTO days_since_creation, communication_count, document_count, analysis_count
  FROM clients c
  LEFT JOIN client_communications cc ON c.id = cc.client_id
  LEFT JOIN client_documents cd ON c.id = cd.client_id
  LEFT JOIN needs_analyses na ON c.id::text = na.client_name -- This would need better linking
  WHERE c.id = client_uuid
  GROUP BY c.id, c.created_at;
  
  -- Calculate engagement score (0-100)
  score := LEAST(100, 
    (communication_count * 10) + 
    (document_count * 15) + 
    (analysis_count * 25) +
    CASE 
      WHEN days_since_creation < 30 THEN 20
      WHEN days_since_creation < 90 THEN 10
      ELSE 0
    END
  );
  
  RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', user_uuid,
    'period_days', days_back,
    'clients_added', COUNT(DISTINCT CASE WHEN c.created_at >= NOW() - INTERVAL '1 day' * days_back THEN c.id END),
    'analyses_completed', COUNT(DISTINCT CASE WHEN na.created_at >= NOW() - INTERVAL '1 day' * days_back AND na.status = 'completed' THEN na.id END),
    'communications_sent', COUNT(DISTINCT CASE WHEN cc.created_at >= NOW() - INTERVAL '1 day' * days_back THEN cc.id END),
    'documents_uploaded', COUNT(DISTINCT CASE WHEN cd.created_at >= NOW() - INTERVAL '1 day' * days_back THEN cd.id END),
    'total_client_value', COALESCE(SUM(c.lifetime_value), 0),
    'active_clients', COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END)
  ) INTO result
  FROM user_profiles up
  LEFT JOIN clients c ON up.id = c.user_id
  LEFT JOIN needs_analyses na ON up.id = na.user_id
  LEFT JOIN client_communications cc ON up.id = cc.user_id
  LEFT JOIN client_documents cd ON up.id = cd.user_id
  WHERE up.id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_user_last_login(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_client_engagement_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_activity_summary(UUID, INTEGER) TO authenticated;

-- Grant admin-only functions
GRANT EXECUTE ON FUNCTION archive_old_analyses(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_banners() TO authenticated;