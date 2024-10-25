output "repository_url" {
  value = aws_ecr_repository.ecr-repo.repository_url
}

output "rds-status" {
    value = aws_db_instance.rds-instance.status
}
