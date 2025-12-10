import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { MdOutlineCatchingPokemon } from "react-icons/md";
import "./Auth.css"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


async function handleSubmit(e){
    e.preventDefault()
    
    try{
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        navigate("/game")
    } catch(error){
        console.error('完整錯誤:', error)
        if(error.code === "auth/wrong-password"){
            setError("密碼錯誤")
        } else if(error.code === "auth/user-not-found"){
            setError("找不到此帳號")
        } else if(error.code === "auth/invalid-email"){
            setError("Email 格式錯誤")
        } else if(error.code === "auth/invalid-credential"){
            setError("Email 或密碼錯誤")
        } else{
            setError("登入失敗：" + error.message)
        }     
    } finally {
        setLoading(false) 
    }
}
    
  return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className='auth-title'><MdOutlineCatchingPokemon />
 Pokémon 進化配對遊戲</h2>
                <h3 className='auth-subtitle'>登入</h3>
    
                {error && <div className='auth-error'>{error}</div>}
    
                <form onSubmit={handleSubmit} className='form'>
                    <div className="group">
                        <label className='label'>Email</label>
                        <input type="email" ref={emailRef} required
                        className='input' placeholder='輸入你的 Email'/>
                    </div>
    
                    <div className="group">
                        <label className='label'>密碼</label>
                        <input type="password" ref={passwordRef} required
                        className='input' placeholder='輸入你的密碼'/>
                    </div>
    
                    <button type='submit' disabled={loading} className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
                    >
                        {loading? "登入中..." : "登入"}
                    </button>
                </form>
            </div>
            
            <div className="auth-link">
            還沒有帳號? <Link to="/signup">註冊</Link>
            </div>
        </div>
  )
}