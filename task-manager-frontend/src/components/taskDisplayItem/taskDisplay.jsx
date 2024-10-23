import styles from './taskDisplay.module.css'
export function TaskDisplay({ task }) {
    return (
        <div className={styles.taskContainer}>
            <p>{task?.priority}</p>
            <p>{task.title}</p>
            <p>{task?.assignedTo}</p>
            <div>
                <p>CheckList: </p>
                {task?.checklist?.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </div>
            <p>{task?.dueDate}</p>
            <p>{task?.taskStatus}</p>
        </div>
    )
}