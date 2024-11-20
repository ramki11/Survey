variable "region" {
  description = "The default AWS region to use for provisioning infrastructure"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "The name of the project used for tagging resources"
  type        = string
  default     = "survey"
}

variable "vpc_data" {
  description = "Variable to hold and object for vpc configuration"

  type = object({
    vpc_cidr = string
    availability_zones = list(object({
      az_name                 = string
      public_subnet_cidr      = string
    }))
  })

  default = {
    vpc_cidr = "172.31.0.0/16"
    availability_zones = [{
      az_name                 = "us-west-2a"
      public_subnet_cidr      = "172.31.16.0/20"

      },
      {
        az_name                 = "us-west-2b"
        public_subnet_cidr      = "172.31.32.0/20"
      },
      {
        az_name                 = "us-west-2c"
        public_subnet_cidr      = "172.31.0.0/20"
    },]
  }
}
