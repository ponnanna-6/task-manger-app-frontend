import { useEffect, useState } from 'react'
import styles from './dashboard.module.css'
import { tokenAvailable } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/navBar/navBar'
import Settings from '../../components/settings/settings'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        if(!tokenAvailable()) {
            navigate('/login')
        }
    }, [])
    return (
        <div className={styles.container}>
            <NavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className={styles.dashboardContainer}>
                {activeTab == 2 && <Settings/>}
            </div>
        </div>
    )
}