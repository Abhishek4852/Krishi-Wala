from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField( max_length=50)
    mobile = models.CharField(max_length=10)
    email = models.EmailField()
    password = models.CharField(max_length=50)

class Land(models.Model):
    land_id = models.AutoField(primary_key=True)
    name = models.CharField( max_length=50)
    state = models.CharField( max_length=50)
    district = models.CharField( max_length=50)
    village = models.CharField( max_length=50)
    mobile = models.CharField( max_length=50)
    LandSize = models.IntegerField()
    TotalRentPrice = models.IntegerField( )
    RentPricePerAcre = models.IntegerField( )
    rentPeriod = models.IntegerField( )
    irrigationSource = models.CharField( max_length=100)
    extraFacilities = models.CharField( max_length=200)
    AccName = models.CharField( max_length=50)
    BankName = models.CharField( max_length=50)
    AccNo = models.CharField( max_length=20)
    IFSC = models.CharField( max_length=20)
    map_location = models.CharField( max_length=20)
    
    
class LandPhotos(models.Model):
    id =  models.AutoField(primary_key=True)
    land_id = models.ForeignKey(Land, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="images/")
    



# labour schema 
class Labour(models.Model):
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    selected_state = models.CharField(max_length=100)
    selected_district = models.CharField(max_length=100)
    selected_village = models.CharField(max_length=100)
    work_type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=50,choices=[("Per Day", "Per Day"), ("Per Hour", "Per Hour")])
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10,choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")])
    experience = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to="labour_avatars/", null=True, blank=True)  # ✅ Stores real image files


# labour bank details
class LabourBank(models.Model):
    labour = models.OneToOneField(Labour, on_delete=models.CASCADE, related_name="bank_details")
    bname = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    b_account_no = models.CharField(max_length=50)
    IFSC = models.CharField(max_length=20)





# machin registration table
class Machine(models.Model):
    owner_name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15)
    state = models.CharField(max_length=100)  # New Field
    district = models.CharField(max_length=100)  # New Field
    village = models.CharField(max_length=100)  # New Field
    machine_name = models.CharField(max_length=255)
    purpose = models.CharField(max_length=255)
    specification = models.TextField()
    with_tractor = models.BooleanField(default=False)
    tractor_company = models.CharField(max_length=255, blank=True, null=True)
    tractor_model = models.CharField(max_length=255, blank=True, null=True)
    hiring_cost_acre = models.IntegerField()
    hiring_cost_hour = models.IntegerField()
    quantity = models.PositiveIntegerField()


# machin images 
class MachineImage(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="machin_images/")  # Stores real image files

# machin owners account details
class MachineAccount(models.Model):
    machine = models.OneToOneField(Machine, on_delete=models.CASCADE)
    bname = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    account_no = models.CharField(max_length=20)
    ifsc = models.CharField(max_length=20)

# labour request table
class LabourRequest(models.Model):
    receiver_mobile = models.CharField("Receiver Mobile Number", max_length=15)
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    workTime = models.CharField("Work Time", max_length=20)
    workUnit = models.CharField("Work Unit", max_length=10)


    state = models.CharField("State", max_length=100)
    district = models.CharField("District", max_length=100)
    village = models.CharField("Village", max_length=100)

    workType = models.CharField("Work Type", max_length=100)
    otherWork = models.CharField("Other Work", max_length=100, blank=True, null=True)
    description = models.TextField("Description", blank=True, null=True)
    period_start = models.DateField("Period Start")
    period_end = models.DateField("Period End")
    status = models.CharField("Status", max_length=20)
    request_date = models.CharField("Request Date", max_length=20)

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)

# land request table
class LandRequest(models.Model):
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    landSize = models.CharField("Land Size", max_length=50)

    period_start = models.DateField("Renting Period Start")
    period_end = models.DateField("Renting Period End")

    description = models.TextField("Description", blank=True, null=True)
    receiver_mobile = models.CharField("Receiver Mobile Number", max_length=15)
    status = models.CharField("Status", max_length=20, default="pending")


    request_date = models.CharField("Request Date", max_length=20)
    land_id = models.IntegerField("Land ID") 

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)



class MachineRequest(models.Model):
    name = models.CharField("Sender Name", max_length=100)
    sender_mobile = models.CharField("Sender Mobile Number", max_length=15)
    hour = models.CharField("Hour", max_length=50)

    period_start = models.DateField("Renting Period Start")
    period_end = models.DateField("Renting Period End")

    state = models.CharField("State", max_length=100)
    district = models.CharField("District", max_length=100)
    village = models.CharField("Village", max_length=100)

    description = models.TextField("Description", blank=True, null=True)
    status = models.CharField("Status", max_length=20, default="pending")

    # From machinedata
    machine_id = models.IntegerField("Machine ID")
    machine_name = models.CharField("Machine Name", max_length=100)
    receiver_mobile = models.CharField("Receiver Mobile (Owner)", max_length=15)

    # Request timestamp
    request_date = models.CharField("Request Date", max_length=20)

    preview_description = models.TextField("Preview Description", blank=True, null=True)
    request_price = models.CharField("Request Price", max_length=50, blank=True, null=True)
    preview_date = models.CharField("Preview Date", max_length=20, blank=True, null=True)

