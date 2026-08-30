import requests

url = "https://pmmpublisher.pps.eosdis.nasa.gov/opensearch"

params = {
    "q": "precip_1d",
    "lat": 38,
    "lon": 100,
    "limit": 1,
    "startTime": "2016-11-12",
    "endTime": "2016-11-12"
}

print("Sending request...")
print(url)
print(params)

response = requests.get(
    url,
    params=params,
    timeout=60
)

print()
print("STATUS:", response.status_code)
print("CONTENT TYPE:", response.headers.get("Content-Type"))
print("FINAL URL:")
print(response.url)

print()
print("FIRST 1000 CHARACTERS:")
print(response.text[:1000])