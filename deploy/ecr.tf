/**
to delete this resource, run aws ecr list-images --repository-name roost-ecr-repo

Then aws ecr batch-delete-images \
    --repository-name roost-ecr-repo \
    --image-ids 'output of list-images'
**/

resource "aws_ecr_repository" "ecr-repo" {
  name = var.ecr-repo-name
  force_delete = true
  image_scanning_configuration {
    scan_on_push = false
  }
}