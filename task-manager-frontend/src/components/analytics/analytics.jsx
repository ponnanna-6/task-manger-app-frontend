import styles from './analytics.module.css'
export default function Analytics ({}) {
    const tasksContainer = [
        {
            name: "Backlog Tasks",
            count: 0
        },
        {
            name: "To-Do Tasks",
            count: 0
        },
        {
            name: "In-Progress Tasks",
            count: 0
        },
        {
            name: "Completed Tasks",
            count: 0
        }
    ]

    const priorityContainer = [
        {
            name: "High Priority Tasks",
            count: 0
        },
        {
            name: "Medium Priority Tasks",
            count: 0
        },
        {
            name: "Low Priority Tasks",
            count: 0
        },
        {
            name: "Due Date Tasks",
            count: 0
        }
    ]

    return (
        <div className={styles.container}>
            <p className={styles.headerText}>Analytics</p>
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "center"}}>
                <div>
                    {tasksContainer.map((item, index) => (
                        <div className={styles.taskContainer}>
                            <p className={styles.taskName}>{item.name}</p>
                            <p className={styles.taskCount}>{item.count}</p>
                        </div>
                    ))}
                </div>
                <div>
                    {priorityContainer.map((item, index) => (
                        <div className={styles.taskContainer}>
                            <p className={styles.taskName}>{item.name}</p>
                            <p className={styles.taskCount}>{item.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}