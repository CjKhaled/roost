# // provision ec2 instance
# resource "aws_instance" "ec2-instance" {
#   ami                         = var.ec2-ami
#   instance_type               = var.ec2-instance-type
#   key_name                    = var.ec2-key
#   subnet_id                   = aws_subnet.public-subnet.id
#   associate_public_ip_address = true
#   vpc_security_group_ids      = [aws_security_group.security-group.id]
#   tags = {
#     Name = var.ec2-instance-name
#   }
# }
