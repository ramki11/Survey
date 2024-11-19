resource "aws_ecr_repository" "instance" {
  name = "survey-sandbox"
}

data "aws_ecr_repository" "instance" {
  name = aws_ecr_repository.instance.name
}


resource "aws_ecs_cluster" "cluster" {
  name               = "survey-sandbox"
  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
}
