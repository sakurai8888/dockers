from fastapi import FastAPI, Header
from enum import Enum
from typing import Annotated
from .routers import items, submitform, getproduct, jwttoken

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


mydata = ['apple', 'banana', 'cherry']


app = FastAPI()
app.include_router(items.router)
app.include_router(submitform.router)
app.include_router(getproduct.router)
app.include_router(jwttoken.router)

@app.get("/")
async def read_user_me():
    return {"This is root endpoint"}


@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}



@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residuals"}



@app.get("/mydata/")
async def read_mydata():
    return {"mydata": mydata}




@app.get("/showheader/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}