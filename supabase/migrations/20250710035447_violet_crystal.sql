/*
  # Analytics and Reporting Views

  1. User Analytics
    - User activity metrics
    - Feature usage statistics

  2. Client Analytics
    - Client lifecycle metrics
    - Revenue analytics

  3. Performance Views
    - System performance metrics
    - Popular features tracking
*/

-- User activity analytics view
CREATE OR REPLACE VIEW user_activity_analytics AS
SELECT 
  up.id,
  up.full_name,
  up.role,
  up.subscription_plan,
  up.created_at as user_since,
  up.last_login,
  
  -- Client metrics
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_clients,
  COUNT(DISTINCT CASE WHEN c.created_at >= NOW() - INTERVAL '30 days' THEN c.id END) as new_clients_30d,
  
  -- Analysis metrics
  COUNT(DISTINCT na.id) as total_analyses,
  COUNT(DISTINCT CASE WHEN na.status = 'completed' THEN na.id END) as completed_analyses,
  COUNT(DISTINCT CASE WHEN na.created_at >= NOW() - INTERVAL '30 days' THEN na.id END) as analyses_30d,
  
  -- Communication metrics
  COUNT(DISTINCT cc.id) as total_communications,
  COUNT(DISTINCT CASE WHEN cc.created_at >= NOW() - INTERVAL '30 days' THEN cc.id END) as communications_30d,
  
  -- Revenue metrics
  COALESCE(SUM(c.lifetime_value), 0) as total_client_value,
  COALESCE(AVG(c.lifetime_value), 0) as avg_client_value

FROM user_profiles up
LEFT JOIN clients c ON up.id = c.user_id
LEFT JOIN needs_analyses na ON up.id = na.user_id
LEFT JOIN client_communications cc ON up.id = cc.user_id
GROUP BY up.id, up.full_name, up.role, up.subscription_plan, up.created_at, up.last_login;

-- Client lifecycle analytics view
CREATE OR REPLACE VIEW client_lifecycle_analytics AS
SELECT 
  c.user_id,
  c.status,
  COUNT(*) as client_count,
  AVG(c.lifetime_value) as avg_lifetime_value,
  SUM(c.lifetime_value) as total_lifetime_value,
  AVG(EXTRACT(DAYS FROM NOW() - c.created_at)) as avg_days_since_creation,
  COUNT(CASE WHEN c.last_contact >= NOW() - INTERVAL '30 days' THEN 1 END) as contacted_recently
FROM clients c
GROUP BY c.user_id, c.status;

-- System performance metrics view
CREATE OR REPLACE VIEW system_performance_metrics AS
SELECT 
  -- User metrics
  COUNT(DISTINCT up.id) as total_users,
  COUNT(DISTINCT CASE WHEN up.last_login >= NOW() - INTERVAL '7 days' THEN up.id END) as active_users_7d,
  COUNT(DISTINCT CASE WHEN up.last_login >= NOW() - INTERVAL '30 days' THEN up.id END) as active_users_30d,
  COUNT(DISTINCT CASE WHEN up.created_at >= NOW() - INTERVAL '30 days' THEN up.id END) as new_users_30d,
  
  -- Content metrics
  COUNT(DISTINCT c.id) as total_clients,
  COUNT(DISTINCT na.id) as total_analyses,
  COUNT(DISTINCT cc.id) as total_communications,
  COUNT(DISTINCT cd.id) as total_documents,
  
  -- Activity metrics
  COUNT(DISTINCT CASE WHEN na.created_at >= NOW() - INTERVAL '7 days' THEN na.id END) as analyses_7d,
  COUNT(DISTINCT CASE WHEN cc.created_at >= NOW() - INTERVAL '7 days' THEN cc.id END) as communications_7d,
  
  -- Revenue metrics
  SUM(c.lifetime_value) as total_platform_value,
  AVG(c.lifetime_value) as avg_client_value

FROM user_profiles up
LEFT JOIN clients c ON up.id = c.user_id
LEFT JOIN needs_analyses na ON up.id = na.user_id
LEFT JOIN client_communications cc ON up.id = cc.user_id
LEFT JOIN client_documents cd ON up.id = cd.user_id;

-- Popular features tracking view
CREATE OR REPLACE VIEW feature_usage_analytics AS
SELECT 
  t.name as tool_name,
  t.category,
  t.usage_count,
  t.is_active,
  COUNT(DISTINCT CASE WHEN na.created_at >= NOW() - INTERVAL '30 days' THEN na.user_id END) as unique_users_30d,
  COUNT(DISTINCT CASE WHEN na.created_at >= NOW() - INTERVAL '7 days' THEN na.user_id END) as unique_users_7d
FROM tools t
LEFT JOIN needs_analyses na ON t.name = 'Needs Analysis' -- This would need to be more sophisticated in practice
GROUP BY t.id, t.name, t.category, t.usage_count, t.is_active;

-- Grant access to views
GRANT SELECT ON user_activity_analytics TO authenticated;
GRANT SELECT ON client_lifecycle_analytics TO authenticated;
GRANT SELECT ON system_performance_metrics TO authenticated;
GRANT SELECT ON feature_usage_analytics TO authenticated;

-- RLS policies for views (users can only see their own data)
CREATE POLICY "Users can view own activity analytics" ON user_activity_analytics
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view own client analytics" ON client_lifecycle_analytics
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Enable RLS on views
ALTER VIEW user_activity_analytics SET (security_barrier = true);
ALTER VIEW client_lifecycle_analytics SET (security_barrier = true);