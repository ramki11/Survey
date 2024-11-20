output "ecs_service_security_group_id" {
  value       = aws_security_group.service.id
  description = "Security group ID for the ECS service created by this module"
}
