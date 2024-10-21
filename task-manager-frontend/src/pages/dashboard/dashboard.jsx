import { useEffect } from 'react'
import styles from './dashboard.module.css'
import { tokenAvailable } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const navigate = useNavigate()
    useEffect(() => {
        if(!tokenAvailable()) {
            navigate('/login')
        }
    }, [])
    return (
        <div>
            <p>Dashboard</p>
        </div>
    )
}