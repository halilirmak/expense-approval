output "endpoint_url" {
  value       = module.elastic_beanstalk.environment_url
  description = "Endpoint url from ebs"
}
