# multi threading about workers 
# async is about tasks

'''

pause the execution of a coroutine until the result of another coroutine .

Non-Blocking Execution - Suspend and Resume - Concurrency Management

_______________________________________________________________________________

Used with Awaitable Objects:

Coroutines: Functions defined with async def.

Tasks: Objects created by asyncio.create_task() or loop.create_task().

Futures: Low-level objects representing an operation that hasn’t completed yet.

'''

import asyncio # think sync works async (share vars, not thread, context switch)

async def Increment():
    i = 0
    await asyncio.sleep(5)
    while (i < 5):
        i += 1
    return i 

async def Decrement():
    i = 0
    await asyncio.sleep(5)
    while (i < 10):
        i += 1
    return i

async def Operation():
    print("Function : Operation 1")

    t1 = asyncio.create_task(Increment())
    t2 = asyncio.create_task(Decrement())
    
    i, x = await asyncio.gather(t1, t2)
    print(f"type : {type(t1)} \nFunction Result : Operation {i} - {x}")


asyncio.run(Operation())
