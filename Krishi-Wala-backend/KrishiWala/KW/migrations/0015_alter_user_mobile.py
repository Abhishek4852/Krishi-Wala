# Generated by Django 5.1.7 on 2025-04-14 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KW', '0014_labourrequest_preview_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='mobile',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]
