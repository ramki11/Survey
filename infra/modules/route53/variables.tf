variable "root_domain" {
    description = "Root domain to use for dns delegation"
    type        = string
}

variable "hosted_zone_domain" {
    description = "Domain for the hosted zone to create"
    type        = string
}

variable "hosted_zone_name" {
    description = "Domain name for the hosted zone to create NS record for in the root domain"
    type        = string
}

variable "subdomain" {
    description = "Subdomain to create A record for"
    type        = string
}

variable "a_record_alias_domain_name" {
    description = "Domain name of the resource to point the A record to"
    type        = string
}

variable "a_record_alias_zone_id" {
    description = "Hosted zone id of the resource to point the A record to"
    type        = string
}

