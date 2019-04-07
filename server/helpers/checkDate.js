function checkToDoDate(input){
    
    let today = new Date()
    let future = new Date(input)
    if(future>=today){
        let year = Number(input.substring(0,4))
        let month = Number(input.substring(5,7))
        let day = Number(input.substring(8,10))
        
        // limit input year
        if(year<=2020){
            return input
        } else {
            return `2025-${month}-${day}`
        }
    } else {
        return today
    }
}

module.exports = checkToDoDate