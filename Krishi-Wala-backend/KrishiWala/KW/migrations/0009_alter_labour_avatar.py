# Generated by Django 5.1.7 on 2025-03-20 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('KW', '0008_machine_district_machine_state_machine_village'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labour',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='labour_avatars/'),
        ),
    ]
