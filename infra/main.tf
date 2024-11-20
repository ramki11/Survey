data "aws_caller_identity" "current" {}


#hold


# Create ecs cluster, service and task definition
module "ecs" {
  source                          = "./modules/ecs"
  region                          = var.region
  project_name                    = var.project_name
  app_name                        = "backend-1"
  private_app_subnets             = module.vpc.public_app_subnets
  vpc_id                          = module.vpc.vpc_id
  load_balancer_security_group_id = module.alb.alb_security_group_id
  target_group_arn                = module.alb.target_group_arn
  ecs_task_execution_role_arn     = module.iam.ecs_task_execution_role_arn
  image_path                      = replace(replace(var.image_path, "{AWS-accountID}", data.aws_caller_identity.current.account_id), "{region}", var.region)
  image_tag                       = var.image_tag
}
