// provision ec2 instance
resource "aws_instance" "ec2-instance" {
  ami                         = var.ec2-ami
  instance_type               = var.ec2-instance-type
  key_name                    = var.ec2-key
  subnet_id                   = aws_subnet.public-subnet.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.security-group.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              service docker start
              usermod -a -G docker ec2-user
              yum install -y aws-cli
              EOF

              
  tags = {
    Name = var.ec2-instance-name
  }
}
