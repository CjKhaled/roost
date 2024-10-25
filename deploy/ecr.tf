resource "aws_ecr_repository" "ecr-repo" {
  name = var.ecr-repo-name
  image_scanning_configuration {
    scan_on_push = false
  }
}