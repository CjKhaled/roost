// this can not be destroyed. 

/**
Run this to ensure you can destroy resources without this being destroyed

terraform state rm aws_s3_bucket.terraform_roost_state
terraform state rm aws_s3_bucket_versioning.terraform_roost_state
terraform state rm aws_s3_bucket_server_side_encryption_configuration.terraform_roost_state
terraform state rm aws_dynamodb_table.terraform_roost_locks
**/

resource "aws_s3_bucket" "terraform_roost_state" {
  bucket        = var.s3-bucket-name
  force_destroy = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_roost_state" {
  bucket = aws_s3_bucket.terraform_roost_state.id
  versioning_configuration {
    status = "Enabled"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_roost_state" {
  bucket = aws_s3_bucket_versioning.terraform_roost_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "terraform_roost_locks" {
  name         = var.dynamodb-name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
