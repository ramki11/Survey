provider "aws" {
  region = "us-west-2" # Replace with your AWS region
}

resource "aws_cloudwatch_metric_alarm" "billing_alarm" {
  alarm_name                = "BillingAlarm"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = "1"
  metric_name               = "EstimatedCharges"
  namespace                 = "AWS/Billing"
  period                    = "21600" # 6 hours
  statistic                 = "Maximum"
  threshold                 = "1.0" # Replace with your billing threshold
  alarm_description         = "Alarm when estimated charges exceed threshold"
  dimensions = {
    Currency = "USD"
  }

  alarm_actions = [
    aws_sns_topic.billing_alert_topic.arn
  ]
}

resource "aws_sns_topic" "billing_alert_topic" {
  name = "BillingAlertTopic"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.billing_alert_topic.arn
  protocol  = "email"
  endpoint  = "ramki.ratnakara@gmail.com.com" # Replace with your email address
}


module "ecs" {
  source = "terraform-aws-modules/ecs/aws"

  name = "ram"

  container_insights = true

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy = [
    {
      capacity_provider = "FARGATE"
      weight            = 1
    }
  ]
}
