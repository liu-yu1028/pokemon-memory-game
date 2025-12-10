import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { MdOutlineCatchingPokemon } from "react-icons/md";
import "./Auth.css"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

async function handleSubmit(e){
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError("密碼不一致！")
    }
    
    if(passwordRef.current.value.length < 6){
       
        return setError("密碼長度至少需要6個字元")
    }
    try{
        setError("")
        setLoading(true)
        await signup(emailRef.current.value, passwordRef.current.value)
        navigate("/game")
    } catch(error){
        console.error('完整錯誤:', error)
        if(error.code === "auth/email-already-in-use"){
            setError("此 Email 已被註冊")
        } else if(error.code === "auth/invalid-email"){
            setError("Email 格式不正確")
        } else{
            setError("註冊失敗： " + error.message)
        }      
    } finally {
        setLoading(false) 
    }
}
    
  return (
    <div className="auth-container">
        <div className="auth-card">
            <h2 className='auth-title'><MdOutlineCatchingPokemon /> Pokémon 進化配對遊戲</h2>
            <h3 className='auth-subtitle'>註冊</h3>

            {error && <div className='auth-error'>{error}</div>}

            <form onClick={handleSubmit} className="form">
                <div className="group">
                    <label className='label'>Email</label>
                    <input type="email" ref={emailRef} required
                    className='input' placeholder='輸入你的 Email'/>
                </div>

                <div className="group">
                    <label className='label'>密碼</label>
                    <input type="password" ref={passwordRef} required
                    className='input' placeholder='至少 6 個字元'/>
                </div>

                <div className="group">
                    <label className='label'>確認密碼</label>
                    <input type="password" ref={passwordConfirmRef} required
                    className='input' placeholder='再次輸入密碼'/>
                </div>

                <button type='submit' disabled={loading} className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                >
                    {loading? "註冊中..." : "註冊"}
                </button>
            </form>
        </div>
        
        <div className="auth-link">
        已經有帳號了嗎? <Link to="/login">登入</Link>
        </div>
    </div>
  )
}