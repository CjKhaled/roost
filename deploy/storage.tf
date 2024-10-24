resource "aws_s3_buckt" "terraform_roost_state" {
    bucket = "terraform-roost-state-unique"
    force_destroy = true
}

resource "aws_s3_bucket_versioning" "terraform_roost_state" {
    bucket = aws_s3_bucket.terraform_roost_state.id
    versioning_configuration {
      status = "Enabled"
    }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_roost_state" {
    bucket = aws_s3_bucket_versioning.terraform_roost_state
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }  
}

resource "aws_dynamodb_table" "terraform_roost_locks" {
  name = "terraform-roost-state-locking"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}