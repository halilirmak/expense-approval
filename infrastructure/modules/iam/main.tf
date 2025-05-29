resource "aws_iam_role" "this" {
  name               = var.name
  assume_role_policy = var.assume_role_policy
  tags               = var.tags
}

resource "aws_iam_role_policy" "this" {
  count  = length(var.policies)
  role   = aws_iam_role.this.name
  policy = var.policies[count.index]
}

output "role_arn" {
  value = aws_iam_role.this.arn
}
