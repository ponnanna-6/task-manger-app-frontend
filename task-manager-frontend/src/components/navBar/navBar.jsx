import styles from './navBar.module.css'
import logo from '../../assets/logo.svg'
import { TbLayoutBoard } from "react-icons/tb";
import { GoDatabase } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { logOutUser } from '../../helper/utils';
import { useNavigate } from 'react-router-dom';

export default function NavBar({activeTab, setActiveTab}) {
    const navigate = useNavigate()

    const options = [
        {   
            id: 0,
            name: "Board",
            icon: () => <TbLayoutBoard/>,
            onClick: () => setActiveTab(0)

        },
        {
            id: 1,
            name: "Analytics",
            icon: () => <GoDatabase/>,
            onClick: () => setActiveTab(1)
        },
        {   
            id: 2,
            name: "Settings",
            icon: () => <IoSettingsOutline/>,
            onClick: () => setActiveTab(2)
        }
    ]

    const onLogoutClick = () => {
        logOutUser()
        navigate('/login')
    }
    return (
        <div className={styles.navBarContainer}>
            <div className={styles.appNameContainer}>
                <img src={logo} alt="Logo"/>
                <p >Pro-Manage</p>
            </div>
            {options?.map((option, index) => {
                return (
                <div 
                    className={option.id == activeTab 
                    ? styles.optionContainerActive
                    : styles.optionContainer}
                    onClick={option.onClick}
                    key={index}
                >
                    <div>{option.icon()}</div>
                    <p>{option.name}</p>
                </div>)
            })}
            <div className={styles.logoutContainer} onClick={onLogoutClick}>
                <IoLogOutOutline className={styles.logoutIcon}/>
                <p>Log Out</p>
            </div>
        </div>
    )
}