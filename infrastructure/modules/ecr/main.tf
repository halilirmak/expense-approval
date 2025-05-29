resource "aws_ecr_repository" "this" {
  name = var.name
}

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name
  policy = templatefile("./policy.json", {
    expire_after_days = var.expire_after_days
  })
}

resource "null_resource" "docker_build_push" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${aws_ecr_repository.this.repository_url}
	    docker build -f ../../docker/Dockerfile -t app .
      docker tag app:latest ${aws_ecr_repository.myapp.repository_url}:latest
      docker push ${aws_ecr_repository.myapp.repository_url}:latest
    EOT
  }
  depends_on = [aws_ecr_repository.this]
}
