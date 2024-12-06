output "hosted_zone" {
  value = aws_route53_zone.hosted_zone
}

output "hosted_zone_zone_id" {
  value = aws_route53_zone.hosted_zone.zone_id
}
