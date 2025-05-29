resource "aws_security_group" "this" {
  name   = var.name
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.name}"
  }
}

resource "aws_security_group_rule" "this" {
  depends_on        = [aws_security_group.this]
  security_group_id = aws_security_group.this.id

  for_each                 = var.rules
  type                     = each.value.type
  from_port                = each.value.from_port
  to_port                  = each.value.to_port
  protocol                 = each.value.protocol
  cidr_blocks              = lookup(each.value, "cidr_blocks", null)
  source_security_group_id = lookup(each.value, "source_security_group_id", null)
  self                     = lookup(each.value, "self", null)
  lifecycle {
    create_before_destroy = true
  }
}
