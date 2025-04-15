from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Land, LandPhotos,Labour,LabourBank,Machine, MachineAccount, MachineImage,Labour,LabourBank,LabourRequest,LandRequest,MachineRequest

from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import jwt

from django.db import transaction

import base64
from django.db.models import Q
import datetime


SECRET_KEY = "Abhishek4852"

@csrf_exempt  # This will disable CSRF for this view
def Registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("Received Data:", data)  # Print data in terminal
        name = data['fname']
        mobile = data['fmobile']
        email = data['femail']
        password = data['fpass'] 

        # Check if user with the same mobile number already exists
        if User.objects.filter(mobile=mobile).exists():
            return JsonResponse({"status": "failure","error": {"code": 400,"message": "User already exists with this mobile number."}}, status=400)

        # Encrypt the password
        encrypt_pass = make_password(password)
        
        # Create and save the new user
        user = User(name=name, mobile=mobile, email=email, password=encrypt_pass)
        user.save()
        print("Data saved")

        return JsonResponse({"message": "Registered Successfully"}, status=200)
    
    return JsonResponse({"error": "Invalid request"}, status=400)
# from datetime import datetime
# import datetime
from datetime import datetime, timedelta  # ✅ fix this import

def get_token(user):
    payload = {
        "user_id": user.user_id,
        "name": user.name,
        "mobile": user.mobile,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(hours=12),  # ✅ fix here
        "iat": datetime.utcnow(),  # ✅ fix here
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token



# from datetime import datetime
@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            mobile = data.get("fmobile")
            password = data.get("fpass")

            user = User.objects.filter(mobile=mobile).first()

            if user:
                if check_password(password, user.password):
                    token = get_token(user)
                    return JsonResponse({
                        "message": "Login successful",
                        "token": token,
                        "status": "success"
                    }, status=200)
                else:
                    return JsonResponse({
                        "message": "Incorrect password",
                        "status": "wrong_password"
                    }, status=401)
            else:
                return JsonResponse({
                    "message": "User not found",
                    "status": "user_not_found"
                }, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)





@csrf_exempt
def token_validation(request):
    if request.method == "POST":
        token_data = json.loads(request.body)
        # print("token data received ",token_data)
        try:
            # Decode and verify the token
            decoded_payload = jwt.decode(token_data["token"],SECRET_KEY, algorithms=["HS256"])
            print(decoded_payload)
            return JsonResponse(decoded_payload,status=200)  # Returns user data from token
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)  # 401  => unauthorise access
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"},status=403)  # invalid toke may be interrupted by someone
    return JsonResponse({"message":"something went wrong"} , status=400) # may internat error 



@csrf_exempt
def post_land(request):
    if request.method == "POST":
        try:
           
            # Extract form data
            landOwner = request.POST.get("landOwner")
            mobile = request.POST.get("mobile")
            selectedState = request.POST.get("selectedState")
            selectedDistrict = request.POST.get("selectedDistrict")
            selectedVillage = request.POST.get("selectedVillage")
            rentPrice = request.POST.get("rentPrice")
            TotalRentPrice = request.POST.get("TotalRentPrice")
            LandSize = request.POST.get("LandSize")
            rentPeriod = request.POST.get("rentPeriod")
            irrigationSource = request.POST.get("irrigationSource")
            extraFacilities = request.POST.get("extraFacilities")
            googleMapLocation = request.POST.get("googleMapLocation")
            
            # Bank details
            AccName = request.POST.get("bankDetails[name]")
            BankName = request.POST.get("bankDetails[bankName]")
            AccNo = request.POST.get("bankDetails[accountNo]")
            IFSC = request.POST.get("bankDetails[IFSC]")

            # Create a new Land entry
            land = Land.objects.create(
                name=landOwner,
                state=selectedState,
                district=selectedDistrict,
                village=selectedVillage,
                mobile=mobile,
                LandSize=LandSize,
                TotalRentPrice=TotalRentPrice,
                RentPricePerAcre=rentPrice,
                rentPeriod=rentPeriod,
                irrigationSource=irrigationSource,
                extraFacilities=extraFacilities,
                AccName=AccName,
                BankName=BankName,
                AccNo=AccNo,
                IFSC=IFSC,
                map_location=googleMapLocation
            )

            # Save Multiple Images
            for file in request.FILES.getlist("landPhotos"):
                LandPhotos.objects.create(land_id=land, image=file)

                print("land photos saved")

            return JsonResponse({"message": "Land details saved successfully!"}, status=201)

        except KeyError as e:
            return JsonResponse({"error": f"Missing key: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method"}, status=405)




@csrf_exempt
def filter_land(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)
    try:
        import json
        data = json.loads(request.body)
        print(data)
        selected_state = data.get("selectedState", "")
        selected_district = data.get("selectedDistrict", "")
        selected_village = data.get("selectedVillage", "")
        size = data.get("size", None)
        price_per_acre = data.get("pricePerAcre", None)
        period = data.get("period", None)
        irrigation_sources = data.get("irrigationSource", [])   # Expecting CSV format

       # Step 1: Filter by State
        land_records = Land.objects.filter(state=selected_state)

        # Step 2: If more than 6 records, filter by District
        if land_records.count() > 6 and selected_district:
            land_records = land_records.filter(district=selected_district)

        # Step 3: If more than 6 records, filter by Village
        if land_records.count() > 6 and selected_village:
            land_records = land_records.filter(village=selected_village)

        # Step 4: If more than 6 records, apply size filter with 40% tolerance
        if land_records.count() > 6 and size is not None:
            min_size = size * 0.6
            max_size = size * 1.4
            land_records = land_records.filter(LandSize__gte=min_size, LandSize__lte=max_size)

        # Step 5: If more than 6 records, apply price filter with 40% tolerance
        if land_records.count() > 6 and price_per_acre is not None:
            min_price = price_per_acre * 0.6
            max_price = price_per_acre * 1.4
            land_records = land_records.filter(RentPricePerAcre__gte=min_price, RentPricePerAcre__lte=max_price)

        # Step 6: If more than 6 records, apply period filter with 40% tolerance
        if land_records.count() > 6 and period is not None:
            min_period = period * 0.6
            max_period = period * 1.4
            land_records = land_records.filter(rentPeriod__gte=min_period, rentPeriod__lte=max_period)

        # Step 7: If more than 6 records, apply irrigation source filter (at least one should match)
        if land_records.count() > 6 and isinstance(irrigation_sources, list):
            irrigation_query = Q()
            for source in irrigation_sources:
                irrigation_query |= Q(irrigationSource__icontains=source.strip())

            land_records = land_records.filter(irrigation_query)

        # Prepare the response data
        response_data = []
        for land in land_records:
            images = LandPhotos.objects.filter(land_id=land)
            image_path_list = [image.image.url for image in images]

            

            response_data.append({
                "land_id": land.land_id,
                "name": land.name,
                "owner_mobile":land.mobile,
                "state": land.state,
                "district": land.district,
                "village": land.village,
                "mobile": land.mobile,
                "LandSize": land.LandSize,
                "TotalRentPrice": land.TotalRentPrice,
                "RentPricePerAcre": land.RentPricePerAcre,
                "rentPeriod": land.rentPeriod,
                "irrigationSource": land.irrigationSource,
                "extraFacilities": land.extraFacilities,
                "AccName": land.AccName,
                "BankName": land.BankName,
                "AccNo": land.AccNo,
                "IFSC": land.IFSC,
                "map_location": land.map_location,
                "images": image_path_list    # Sending images as Base64
            })
        print(response_data)
        return JsonResponse(response_data, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def labour_registration(request):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        # Get form data
        name = request.POST.get("name")
        mobile = request.POST.get("mobile")
        selected_state = request.POST.get("selectedState")
        selected_district = request.POST.get("selectedDistrict")
        selected_village = request.POST.get("selectedVillage")
        work_type = request.POST.get("workType")
        price = request.POST.get("price")
        price_type = request.POST.get("priceType")
        age = request.POST.get("age")
        gender = request.POST.get("gender")
        experience = request.POST.get("experience")

        # Get optional bank details
        bname = request.POST.get("bname")
        bank_name = request.POST.get("bankName")
        b_account_no = request.POST.get("bAccountNo")
        ifsc = request.POST.get("IFSC")

        # Get avatar (uploaded file)
        avatar = request.FILES.get("avatar")

        required_fields = [name, mobile, selected_state, selected_district, selected_village, work_type, price, price_type, age, gender, experience]
        if not all(required_fields):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        with transaction.atomic():
            # Insert Labour details
            labour = Labour.objects.create(
                name=name,
                mobile=mobile,
                selected_state=selected_state,
                selected_district=selected_district,
                selected_village=selected_village,
                work_type=work_type,
                price=price,
                price_type=price_type,
                age=age,
                gender=gender,
                experience=experience,
                avatar=avatar  # ✅ Save the uploaded image
            )

            # Insert bank details only if all fields are provided
            if bname and bank_name and b_account_no and ifsc:
                LabourBank.objects.create(
                    labour=labour,
                    bname=bname,
                    bank_name=bank_name,
                    b_account_no=b_account_no,
                    IFSC=ifsc
                )

        return JsonResponse({"message": "Labour registered successfully!"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def machine_registration(request):
    if request.method == "POST":
        try:
            # Extract form data
            owner_name = request.POST.get("ownerName")
            mobile_no = request.POST.get("Mobileno")
            state = request.POST.get("selectedState")
            district = request.POST.get("selectedDistrict")
            village = request.POST.get("selectedVillage")
            machine_name = request.POST.get("machineName")
            purpose = request.POST.get("purpose")
            specification = request.POST.get("specification")
            with_tractor = request.POST.get("withTractor") == "Yes"  # Convert "Yes" to True
            tractor_company = request.POST.get("tractorCompany", "")
            tractor_model = request.POST.get("tractorModel", "")
            hiring_cost_acre = int(request.POST.get("hiringCostAcre", 0))
            hiring_cost_hour = int(request.POST.get("hiringCostHour", 0))
            quantity = int(request.POST.get("quantity", 1))

            # Create Machine object
            machine = Machine.objects.create(
                owner_name=owner_name,
                mobile_no=mobile_no,
                state=state,
                district=district,
                village=village,
                machine_name=machine_name,
                purpose=purpose,
                specification=specification,
                with_tractor=with_tractor,
                tractor_company=tractor_company,
                tractor_model=tractor_model,
                hiring_cost_acre=hiring_cost_acre,
                hiring_cost_hour=hiring_cost_hour,
                quantity=quantity
            )

            # Save bank details
            MachineAccount.objects.create(
                machine=machine,
                bname=request.POST.get("bname"),
                bank_name=request.POST.get("bankName"),
                account_no=request.POST.get("bAccountNo"),
                ifsc=request.POST.get("IFSC")
            )

            # Save uploaded images
            images = request.FILES.getlist("machinePhoto")
            for file in images:
                MachineImage.objects.create(machine=machine, image=file)

            return JsonResponse({"message": "Machine registered successfully!"}, status=201)

        except Exception as e:
            print(traceback.format_exc())  # Print detailed error for debugging
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def search_machine(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # print("Data received:", data)

        selected_state = data.get("selectedState")
        selected_district = data.get("selectedDistrict")
        selected_village = data.get("selectedVillage")
        machine_purpose = data.get("machinePurpose")
        machine_name = data.get("machineName")
        with_tractor = data.get("withTractor")
        tractor_brand = data.get("tractorBrand")
        tractor_model = data.get("tractorModel")

        # Step 1: Filter by state
        machines = Machine.objects.filter(state=selected_state)

        # Step 2: If more than 6 machines, filter by district
        if machines.count() > 6 and selected_district:
            machines = machines.filter(district=selected_district)

        # Step 3: If more than 6, filter by village
        if machines.count() > 6 and selected_village:
            machines = machines.filter(village=selected_village)

        # Step 4: If more than 6, filter by machine purpose
        if machines.count() > 6 and machine_purpose:
            machines = machines.filter(purpose=machine_purpose)

        # Step 5: If more than 6, filter by machine name
        if machines.count() > 6 and machine_name:
            machines = machines.filter(machine_name=machine_name)

        # Step 6: If more than 6, filter by withTractor
        if machines.count() > 6 and with_tractor is not None:
            machines = machines.filter(with_tractor=with_tractor)

        # Step 7: If more than 6, filter by tractor brand and model
        if machines.count() > 6 and tractor_brand:
            machines = machines.filter(tractor_company=tractor_brand)
        if machines.count() > 6 and tractor_model:
            machines = machines.filter(tractor_model=tractor_model)

        # Prepare response
        response_data = []
        for machine in machines:
            response_data.append({
                "id": machine.id,
                "owner_mobile": machine.mobile_no,
                "machineName": machine.machine_name,
                "machinePurpose": machine.purpose,
                "withTractor": machine.with_tractor,
                "tractorBrand": machine.tractor_company if machine.tractor_company else "",
                "tractorModel": machine.tractor_model if machine.tractor_model else "",
                "hiringCostPerAcre": machine.hiring_cost_acre,
                "hiringCostPerHour": machine.hiring_cost_hour,
                "location": {
                    "state": machine.state,
                    "district": machine.district,
                    "village": machine.village,
                },
                "machinePhotos": [
                    request.build_absolute_uri(image.image.url) for image in machine.images.all()
                ],
            })
       
        return JsonResponse(response_data, safe=False)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def search_labour(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        # print("Received Data:", data)

        # Extracting filters from request
        selected_state = data.get("selectedState")
        selected_district = data.get("selectedDistrict")
        selected_village = data.get("selectedVillage")
        work_type = data.get("workType")
        experience = data.get("minimumExp")
        wage_per_day = data.get("wagePerDay")
        wage_per_hour = data.get("wagePerHour")

        # Start with filtering by state
        query = Labour.objects.filter(selected_state=selected_state)
        
        # Apply filters step by step if records > 6
        if query.count() > 6:
            query = query.filter(selected_district=selected_district)
        
        if query.count() > 6:
            query = query.filter(selected_village=selected_village)
        
        if query.count() > 6 and work_type:
            query = query.filter(work_type=work_type)
        
        if query.count() > 6 and experience:
            query = query.filter(experience__gte=int(experience))
        
        if query.count() > 6 and wage_per_day:
            query = query.filter(price_type="Per Day", price__lte=float(wage_per_day))
        
        if query.count() > 6 and wage_per_hour:
            query = query.filter(price_type="Per Hour", price__lte=float(wage_per_hour))

        # Convert query results to the required JSON format
        labour_list = [
            {
                "id": labour.id,
                "name": labour.name,
                "owner_mobile":labour.mobile,
                "labourType": labour.work_type,
                "experience": f"{labour.experience} years",
                "dailyWage": float(labour.price),
                "availability": True,  # Assuming availability is always True
                "location": {
                    "state": labour.selected_state,
                    "district": labour.selected_district,
                    "village": labour.selected_village,
                },
                "profilePhoto": labour.avatar.url if labour.avatar else "default.jpg",
            }
            for labour in query
        ]
        print("data sending",labour_list)
        return JsonResponse({"labourListings": labour_list}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from datetime import datetime
@csrf_exempt
def labour_request(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        try:
            current_date = datetime.now().strftime("%d-%m-%Y")  # formatted current date

            LabourRequest.objects.create(
                receiver_mobile=data.get("receiver_mobile"),
                name=data.get("name"),
                sender_mobile=data.get("mobile"),
                workTime=data.get("workTime"),
                workUnit=data.get("workUnit"),
                state=data.get("workLocation", {}).get("state"),
                district=data.get("workLocation", {}).get("district"),
                village=data.get("workLocation", {}).get("village"),
                workType=data.get("workType"),
                otherWork=data.get("otherWork", ""),
                description=data.get("description", ""),
                period_start=data.get("period", {}).get("start"),
                period_end=data.get("period", {}).get("end"),
                status=data.get("status", "pending"),
                request_date=current_date
            )

            return JsonResponse({"message": "Request saved successfully"}, status=200)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Failed to save data"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def land_request(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)

        try:
            current_date = datetime.now().strftime("%d-%m-%Y")  # formatted current date

            LandRequest.objects.create(
                name=data.get("name"),
                sender_mobile=data.get("sender_mobile"),
                landSize=data.get("landSize"),
                period_start=data.get("rentingPeriod", {}).get("start"),
                period_end=data.get("rentingPeriod", {}).get("end"),
                description=data.get("description", ""),
                receiver_mobile=data.get("receiver_mobile"),
                status=data.get("status", "pending"),
                request_date=current_date,
                land_id=data.get("land_id")
            )

            return JsonResponse({"message": "Request saved successfully"}, status=200)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Failed to save data"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)




@csrf_exempt
def machine_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # print(data)

            current_date = datetime.now().strftime("%d-%m-%Y")

            machine = data.get("machinedata", {})

            MachineRequest.objects.create(
                name=data.get("name"),
                sender_mobile=data.get("sender_mobile"),
                hour=data.get("hour"),
                period_start=data.get("rentingPeriod", {}).get("start"),
                period_end=data.get("rentingPeriod", {}).get("end"),
                state=data.get("location", {}).get("state"),
                district=data.get("location", {}).get("district"),
                village=data.get("location", {}).get("village"),
                description=data.get("description", ""),
                status=data.get("status", "pending"),
                machine_id=machine.get("id"),
                machine_name=machine.get("machineName"),
                receiver_mobile=machine.get("owner_mobile"),
                request_date=current_date
            )

            return JsonResponse({"message": "Machine request saved"}, status=200)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Failed to process request"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def recieved_request(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            receiver_mobile = body.get("receiver_mobile")

            if not receiver_mobile:
                return JsonResponse({"error": "receiver_mobile is required"}, status=400)

            response_data = []

            # 🔹 Land Requests
            land_requests = LandRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in land_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Land Rent",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "landSize": req.landSize,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "status": req.status,
                        "land_id": req.land_id,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            # 🔹 Machine Requests
            machine_requests = MachineRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in machine_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Machine Rent",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "hour": req.hour,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "machine_id": req.machine_id,
                        "machine_name": req.machine_name,
                        "status": req.status,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            # 🔹 Labour Requests
            labour_requests = LabourRequest.objects.filter(receiver_mobile=receiver_mobile)
            for req in labour_requests:
                response_data.append({
                    "id": req.id,
                    "type": "Labour",
                    "receivedDate": req.request_date,
                    "recivere_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "workTime": req.workTime,
                        "workUnit": req.workUnit,
                        "workType": req.workType,
                        "otherWork": req.otherWork,
                        "description": req.description,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "status": req.status,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "preview_date": req.preview_date,
                    }
                })

            print(response_data)
            return JsonResponse(response_data, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)





@csrf_exempt
def sent_request(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            sender_mobile = body.get("sender_mobile")

            if not sender_mobile:
                return JsonResponse({"error": "Sender mobile is required."}, status=400)

            data = []

            # Labour Requests
            labour_requests = LabourRequest.objects.filter(sender_mobile=sender_mobile)
            for req in labour_requests:
                data.append({
                    "id": req.id,
                    "type": "labour",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "workTime": req.workTime,
                        "workUnit": req.workUnit,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "workType": req.workType,
                        "otherWork": req.otherWork,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })

            # Land Requests
            land_requests = LandRequest.objects.filter(sender_mobile=sender_mobile)
            for req in land_requests:
                data.append({
                    "id": req.id,
                    "type": "land",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "landSize": req.landSize,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "land_id": req.land_id,
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })

            # Machine Requests
            machine_requests = MachineRequest.objects.filter(sender_mobile=sender_mobile)
            for req in machine_requests:
                data.append({
                    "id": req.id,
                    "type": "machine",
                    "sentDate": req.request_date,
                    "status": req.status,
                    "receiver_mobile": req.receiver_mobile,
                    "sender": {
                        "name": req.name,
                        "mobile": req.sender_mobile,
                        "description": req.description,
                        "hour": req.hour,
                        "state": req.state,
                        "district": req.district,
                        "village": req.village,
                        "machine_id": req.machine_id,
                        "machine_name": req.machine_name,
                        "period_start": str(req.period_start),
                        "period_end": str(req.period_end),
                        "preview_description": req.preview_description,
                        "request_price": req.request_price,
                        "response_date": req.preview_date
                    }
                })
           
            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)



@csrf_exempt
def preview_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)

            request_info = data['preview_request']
            request_type = request_info['type']
            receiver_mobile = request_info['recivere_mobile']
            request_id = request_info['id']

            # Fields to update
            new_status = data['preview_status']
            new_description = data['preview_description']
            new_price = data['preview_price']
            preview_date = datetime.now().strftime("%d-%m-%Y")  # today's date

            # Choose model based on request type
            if request_type == "Land Rent":
                try:
                    target = LandRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    return JsonResponse({"message": "Land request updated successfully"}, status=200)
                except LandRequest.DoesNotExist:
                    return JsonResponse({"error": "Land request not found"}, status=404)

            elif request_type == "Machine Rent":
                try:
                    target = MachineRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    return JsonResponse({"message": "Machine request updated successfully"}, status=200)
                except MachineRequest.DoesNotExist:
                    return JsonResponse({"error": "Machine request not found"}, status=404)

            elif request_type == "Labour":
                try:
                    target = LabourRequest.objects.get(id=request_id, receiver_mobile=receiver_mobile)
                    target.status = new_status
                    target.preview_description = new_description
                    target.request_price = new_price
                    target.preview_date = preview_date
                    target.save()
                    return JsonResponse({"message": "Labour request updated successfully"}, status=200)
                except LabourRequest.DoesNotExist:
                    return JsonResponse({"error": "Labour request not found"}, status=404)

            else:
                return JsonResponse({"error": "Invalid request type"}, status=400)

        except Exception as e:
            return JsonResponse({"error": f"Something went wrong: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)


@csrf_exempt
def abhishek4852(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Check token authentication
        if data.get("token") != "Abhishek4852":
            return JsonResponse({"error": "Unauthorized"}, status=401)

        # Static sample data
        names = ["Abhi", "Rahul", "Priya", "Ankit", "Neha", "Vikas", "Pooja", "Amit", "Kavita", "Rohan"]
        passwords = ["pass123", "test456", "demo789", "abc@123", "xyz@321", "hello@123", "mypwd456", "newpass789", "try321", "secure456"]
        states = ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Bihar", "Gujarat"]
        districts = ["Indore", "Bhopal", "Jaipur", "Lucknow", "Patna"]
        villages = ["Rampur", "Bhainsa", "Kukshi", "Barwani", "Dewas"]
        mobiles = [
            "9876543210", "9123456789", "8899776655", "9765432109", "9988776655",
            "9090909090", "8822446688", "7890123456", "9345678901", "9988123456"
        ]

        for i in range(10):
            # User
            user = User.objects.create(
                name=names[i],
                mobile=mobiles[i],
                email=f"user{i}@example.com",
                password=passwords[i]
            )

            # Land
            land = Land.objects.create(
                name=names[i],
                state=states[i % len(states)],
                district=districts[i % len(districts)],
                village=villages[i % len(villages)],
                mobile=mobiles[i],
                LandSize=5 + i,
                TotalRentPrice=15000 + (i * 1000),
                RentPricePerAcre=3000 + (i * 100),
                rentPeriod=6 + i,
                irrigationSource="Canal",
                extraFacilities="Water, Electricity",
                AccName=names[i],
                BankName="SBI",
                AccNo=f"1234567890{i}",
                IFSC="SBIN0001234",
                map_location=f"loc_{i}"
            )

            # Labour
            labour = Labour.objects.create(
                name=names[i],
                mobile=mobiles[i],
                selected_state=states[i % len(states)],
                selected_district=districts[i % len(districts)],
                selected_village=villages[i % len(villages)],
                work_type="Harvesting",
                price=500 + i * 10,
                price_type="Per Day",
                age=20 + i,
                gender="Male" if i % 2 == 0 else "Female",
                experience=1 + i
            )

            LabourBank.objects.create(
                labour=labour,
                bname=names[i],
                bank_name="PNB",
                b_account_no=f"9988776655{i}",
                IFSC="PUNB0123456"
            )

            # Machine
            machine = Machine.objects.create(
                owner_name=names[i],
                mobile_no=mobiles[i],
                state=states[i % len(states)],
                district=districts[i % len(districts)],
                village=villages[i % len(villages)],
                machine_name="Tractor",
                purpose="Ploughing",
                specification="Heavy Duty",
                with_tractor=True,
                tractor_company="Mahindra",
                tractor_model="575 DI XP Plus",
                hiring_cost_acre=1000 + i * 100,
                hiring_cost_hour=300 + i * 10,
                quantity=2 + i
            )

            MachineAccount.objects.create(
                machine=machine,
                bname=names[i],
                bank_name="BOB",
                account_no=f"4455667788{i}",
                ifsc="BARB0XYZ123"
            )

            today = timezone.now().date()

            LandRequest.objects.create(
                name=names[i],
                sender_mobile=mobiles[i],
                landSize=str(3 + i),
                period_start=today,
                period_end=today,
                description="Looking for temporary lease",
                receiver_mobile=mobiles[i],
                status="pending",
                request_date=str(today),
                land_id=land.land_id,
                preview_description="Short term",
                request_price="5000",
                preview_date=str(today)
            )

            LabourRequest.objects.create(
                receiver_mobile=mobiles[i],
                name=names[i],
                sender_mobile=mobiles[i],
                workTime="8 hours",
                workUnit="Day",
                state=states[i % len(states)],
                district=districts[i % len(districts)],
                village=villages[i % len(villages)],
                workType="Sowing",
                otherWork="N/A",
                description="Need help for sowing crop",
                period_start=today,
                period_end=today,
                status="pending",
                request_date=str(today),
                preview_description="Sowing support",
                request_price="400",
                preview_date=str(today)
            )

            MachineRequest.objects.create(
                name=names[i],
                sender_mobile=mobiles[i],
                hour="4",
                period_start=today,
                period_end=today,
                state=states[i % len(states)],
                district=districts[i % len(districts)],
                village=villages[i % len(villages)],
                description="Need for 4 hours of ploughing",
                status="pending",
                machine_id=machine.id,
                machine_name=machine.machine_name,
                receiver_mobile=mobiles[i],
                request_date=str(today),
                preview_description="Urgent need",
                request_price="1000",
                preview_date=str(today)
            )

        return JsonResponse({"message": "Dummy data inserted successfully!"}, status=201)

    return JsonResponse({"error": "Invalid request method."}, status=400)