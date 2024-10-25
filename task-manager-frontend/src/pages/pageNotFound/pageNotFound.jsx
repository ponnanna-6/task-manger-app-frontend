import styles from './pageNotFound.module.css'
import AstroImage from '../../assets/astro.png'

export default function PageNotFound({}) {
  
    return (
        <div className={styles.container}>
            <div className={styles.container1}>
                <div className={styles.circleContainer}>
                </div>
                <img src={AstroImage} alt='Asto image' className={styles.imageStyle}/>
                <p className={styles.imageBigText} style={{color: 'red'}}>404 ERROR</p>
                <p className={styles.imageBigText} style={{top: '70%'}}>Page Not Found</p>
            </div>
        </div>
    )
}