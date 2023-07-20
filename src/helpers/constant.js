export const Notification = {
    "pending": "has requested for Leave",
    "approved": "Your leave is Approved",
    "rejected": "Your leave request is Rejected"
}



export const diffBetweenTwoDates = (v1, v2) => {

    console.log("dates", v1, v2)
    let a = new Date(v1)
    let b = new Date(v2)
    let days = (b - a) / 8640000
    let hour = (b - a) / 3600000
    let minutes = (b - a) / 60000
    let seconds = (b - a) / 1000

    if (days > 1) {
        console.log(`${parseInt(days)} days ago`)
        return `${parseInt(days)} days ago`
    }
    else if (hour > 1) {
        console.log(`${parseInt(hour)} hour ago`)
        return `${parseInt(hour)} hour ago`
    }
    else if (minutes > 1 || seconds == 60) {
        console.log(`${parseInt(minutes)} minutes ago`)
        return `${parseInt(minutes)} minutes ago`
    }
    else if (seconds > 1) {
        console.log(`${parseInt(seconds)} seconds ago`)
        return `${parseInt(seconds)} seconds ago`
    } else {
        console.log('1 second ago')
        return `1 second ago`
    }
    // console.log(seconds,minutes,hour,days)
}