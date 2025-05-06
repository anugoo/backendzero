from django.http.response import JsonResponse
from django.shortcuts import render
from datetime import datetime
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from backend.settings import sendMail, sendResponse ,disconnectDB, connectDB, resultMessages,generateStr


# Function to retrieve all products from the database

def dt_allproducts(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    try:
        # Connect to the database
        myConn = connectDB()
        cursor = myConn.cursor()

        # Query to fetch all products
        query = """SELECT p.pid, p.pname, t.tname, s.sname, p.too, p.une,p.receptiondate, p.image
FROM 
    t_product p INNER JOIN t_turul t ON p.tid = t.tid
	INNER JOIN t_supplier s ON p.sid = s.sid  WHERE p.status = TRUE;
"""
        cursor.execute(query)
        columns = cursor.description
        respRow = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]

        if respRow:
            respdata = respRow
            resp = sendResponse(request, 3032, respdata, action)  # Successfully fetched products
        else:
            respdata = [{"error": "No products found"}]
            resp = sendResponse(request, 3033, respdata, action)  # No products found
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5014, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)
    
    return JsonResponse(resp)

# {
#   "action": "productdeteil",
#   "pid": 1
# }
def dt_productdetail(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    try:
        pid = jsons['pid']
        
        myConn = connectDB()
        cursor = myConn.cursor()
        
        query = f"""SELECT p.pid, p.pname, t.tname, s.sname, p.too, p.une,p.receptiondate, p.image
FROM 
    t_product p INNER JOIN t_turul t ON p.tid = t.tid
	INNER JOIN t_supplier s ON p.sid = s.sid  WHERE p.status = TRUE and pid = {pid}"""
        cursor.execute(query)
        columns = cursor.description
        respRow = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]
        
        if respRow:
            respdata = respRow
            resp = sendResponse(request, 3028, respdata, action)  # Бараа амжилттай олдсон
        else:
            respdata = [{"error": "Product not found"}]
            resp = sendResponse(request, 3027, respdata, action)  # Бараа олдсонгүй
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5010, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)
    return JsonResponse(resp)
 
# {
#   "action": "updateproduct",
#   "pid": 1,
#   "pname": "",
#   "sid": 2,
#   "tid": 3,
#   "too": 200,
#   "une": 1200,
#   "status": 1,
#   "receptiondate": "2024-12-17",
#   "image": "new_image_url_or_file"
# }
def dt_updateproduct(request):

    jsons = json.loads(request.body)
    action = jsons.get('action')
    cursor = None  # Initialize cursor to None
    myConn = None  # Initialize myConn to None
    try:
        pid = jsons['pid']
        new_pname = jsons.get('pname', None)
        new_too = jsons.get('too', None)
        new_une = jsons.get('une', None)
        new_image = jsons.get('image', None)
        
        myConn = connectDB()  # Your function to connect to the DB
        cursor = myConn.cursor()
        
        query = f"""
        UPDATE t_product 
        SET pname = COALESCE(%s, pname), 
            too = COALESCE(%s, too),
            une = COALESCE(%s, une),
            image = COALESCE(%s, image)
        WHERE pid = %s
        """
        cursor.execute(query, (new_pname, new_too, new_une, new_image, pid))
        myConn.commit()
        
        respdata = [{"pid": pid, "pname": new_pname, "too": new_too, "une": new_une, "image": new_image}]
        resp = sendResponse(request, 3029, respdata, action)  # Success response
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5010, respdata, action)  # Error response
    finally:
        if cursor:
            cursor.close()
        if myConn:
            disconnectDB(myConn)
    return JsonResponse(resp)



def dt_getsupplier(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    try:
        # Connect to the database
        myConn = connectDB()
        cursor = myConn.cursor()

        # Query to fetch all products
        query = """SELECT sid,sname
FROM 
    t_supplier
"""
        cursor.execute(query)
        columns = cursor.description
        respRow = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]

        if respRow:
            respdata = respRow
            resp = sendResponse(request, 3034, respdata, action)  # Successfully fetched products
        else:
            respdata = [{"error": "No supplier"}]
            resp = sendResponse(request, 3035, respdata, action)  # No products found
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5015, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)
    
    return JsonResponse(resp)

def dt_getturul(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    try:
        # Connect to the database
        myConn = connectDB()
        cursor = myConn.cursor()

        # Query to fetch all products
        query = """SELECT tid,tname
FROM 
    t_turul
"""
        cursor.execute(query)
        columns = cursor.description
        respRow = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]

        if respRow:
            respdata = respRow
            resp = sendResponse(request, 3036, respdata, action)  # Successfully fetched products
        else:
            respdata = [{"error": "No turul"}]
            resp = sendResponse(request, 3037, respdata, action)  # No products found
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5016, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)
    
    return JsonResponse(resp)


# {
#   "action": "addproduct",
#   "pname": "Бараа нэр",
#   "sid": 1,
#   "tid": 2,
#   "too": 100,
#   "une": 1500,
#   "status": 1,
#   "receptiondate": "2024-12-16",
#   "image": "image_url_or_file"
# }
def dt_addproduct(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    cursor = None  # Initialize cursor to None
    try:
        pname = jsons['pname']
        sid = jsons['sid']
        tid = jsons['tid']
        too = jsons['too']
        une = jsons['une']
        status = jsons['status']
        image = jsons.get('image', None)
        receptiondate = datetime.now()

        myConn = connectDB()
        cursor = myConn.cursor()

        query = """INSERT INTO t_product (pname, sid, tid, too, une, status, receptiondate, image)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (pname, sid, tid, too, une, status, receptiondate, image))
        myConn.commit()

        respdata = [{"pname": pname, "sid": sid, "tid": tid, "too": too, "une": une, "status": status, "receptiondate": receptiondate, "image": image}]
        resp = sendResponse(request, 3030, respdata, action)
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5012, respdata, action)
    finally:
        if cursor:  # Check if cursor was created before closing it
            cursor.close()
        disconnectDB(myConn)
    return JsonResponse(resp)


def dt_deleteproduct(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    try:
        pid = jsons['pid']
        
        myConn = connectDB()
        cursor = myConn.cursor()
        
        query = f"""DELETE FROM t_product WHERE pid = {pid}"""
        cursor.execute(query)
        myConn.commit()
        
        respdata = [{"pid": pid}]
        resp = sendResponse(request, 3031, respdata, action)  # Бараа амжилттай устгасан
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 5013, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)
    return JsonResponse(resp)

    
def dt_togglewishlist(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    uid = jsons['uid']
    pid = jsons['pid']

    try:
        myConn = connectDB()
        cursor = myConn.cursor()

        cursor.execute("SELECT * FROM t_wishlist WHERE uid = %s AND pid = %s", (uid, pid))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("DELETE FROM t_wishlist WHERE uid = %s AND pid = %s", (uid, pid))
            message = "Removed from wishlist"
        else:
            cursor.execute("INSERT INTO t_wishlist(uid, pid) VALUES (%s, %s)", (uid, pid))
            message = "Added to wishlist"

        myConn.commit()
        respdata = [{"message": message}]
        resp = sendResponse(request, 6001, respdata, action)
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 6010, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)

    return JsonResponse(resp)


# Сагсанд нэмэх
def dt_addtocart(request):
    jsons = json.loads(request.body)
    action = jsons.get('action')
    uid = jsons['uid']
    pid = jsons['pid']
    quantity = jsons.get('quantity', 1)

    try:
        myConn = connectDB()
        cursor = myConn.cursor()
        cursor.execute("INSERT INTO t_cart(uid, pid, quantity) VALUES (%s, %s, %s)", (uid, pid, quantity))
        myConn.commit()
        respdata = [{"message": "Added to cart"}]
        resp = sendResponse(request, 6101, respdata, action)
    except Exception as e:
        respdata = [{"error": str(e)}]
        resp = sendResponse(request, 6110, respdata, action)
    finally:
        cursor.close()
        disconnectDB(myConn)

    return JsonResponse(resp)




@csrf_exempt
def editcheckService(request):
    if request.method == "POST":
        try:
            jsons = json.loads(request.body)
        except:
            action = "no action"
            respdata = []
            resp = sendResponse(request, 3003, respdata)  # Standard error response
            return JsonResponse(resp)  # Make sure to return JsonResponse here
            
        try:
            action = jsons["action"]
        except:
            action = "no action"
            respdata = []
            resp = sendResponse(request, 3005, respdata, action)  # Error if action is missing
            return JsonResponse(resp)

        if action == "addproduct":
            return dt_addproduct(request)
        elif action == "productdetail":
            return dt_productdetail(request)
        elif action == "updateproduct":
            return dt_updateproduct(request)
        elif action == "deleteproduct":
            return dt_deleteproduct(request)
        elif action == "allproducts":
            return dt_allproducts(request)
        elif action == "getturul":
            return dt_getturul(request)
        elif action == "getsupplier":
            return dt_getsupplier(request)
        else:
            action = "no action"
            respdata = []
            resp = sendResponse(request, 3001, respdata, action)
            return JsonResponse(resp)  # Ensure JsonResponse is returned here
    else:
        action = "no action"
        respdata = []
        resp = sendResponse(request, 3002, respdata, action)
        return JsonResponse(resp)

