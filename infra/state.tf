terraform {
  backend "s3" {
    bucket         = "survey-terraform-state-eu-west-2"
    key            = "survey/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "survery-terraform-state-lock"
    encrypt        = true
  }
}
