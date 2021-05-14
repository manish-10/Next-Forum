//1. Login form for name,email,password
//2. Send POST request to /api/auth/Register
//3.If there is an error ,return error
//4. If successful, return to root 
import {useAuthDispatch ,useAuthState} from '../../src/context/auth'
import { useForm } from 'react-hook-form'
import {useRouter} from 'next/router'
import { useEffect } from 'react'
import Layout from '../../src/components/Layout'
export default function RegisterPage() {
    const { handleSubmit, register,setError,formState: { isSubmitting, errors } } = useForm()
    const {register: createUser} = useAuthDispatch()
    const {isAuthenticated} = useAuthState()
    const router = useRouter()

    useEffect(()=>{
        if(isAuthenticated)
        router.push('/')
    },[isAuthenticated])

    const onSubmit = async ({name,email,password}) => { 
        try{
            await createUser({name,email,password})
            router.push('/')
        }
        catch({message})
        {
            setError('email',
            {
                type:"manual",
                message,
            })
        }
        
    }
    return (

        <>
            <h1 className="text-2xl">Create an account</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="text" id="name" {...register("name", { required: "Please enter your name" })} placeholder="Name" />
                    {errors.name && <span>{errors.name.message}</span>}
                </div>

                <div>
                    <input type="email" id="email" {...register("email", { required: "Please enter your email", pattern:{message:"Please enter a valid email", } })} placeholder="Email" />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>

                <div>
                    <input type="password" id="password" {...register("password",
                        {
                            required: "Please enter your password",
                            minLength:
                                { message: "Your password must be 6 char long", value: 6 }
                        })}
                        placeholder="Password" />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>

                <input type="submit" disabled={isSubmitting} value={"Create Account"} />


            </form>
        </>
    )
}
RegisterPage.Layout = Layout