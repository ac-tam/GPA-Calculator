var gymEntered = false;

function quick()
{
    var str = document.getElementById("direct").value;
    if (str.length > 0)
    {  
        document.getElementById("faq").style.display = "none";
        document.getElementById("pupilpath").style.display = "none";
        document.getElementById("pl").style.display = "block";
        var gradeArray = [];

        var start;
        for (var i = 0; i < str.length; i++)
            if (str.substring(i, i + 1) === ":")
                if (str.substring(i, i + 5).indexOf(" - ") < 0 && determineWeight(str, start, i) != "none")
                {
                    gradeArray.push(new Grade(findNums(str, i), determineWeight(str, start, i)))
                    start = i + (gradeArray[gradeArray.length-1].getAvg() +"").length
                    i = start
                }
                else
                {
                    i += 6;
                    start = i;
                } 
   
        var normal = "";
        var gym = "";
        var ap = "";
        var potentialpltw = "";
        var count = 0;

        for (var i = 0; i < gradeArray.length; i++)
            if (gradeArray[i].getType() == "ap") 
                ap += gradeArray[i].getAvg() + ", ";
            else if (gradeArray[i].getType() == "gym") 
                gym += gradeArray[i].getAvg();
            else
            {
                normal += gradeArray[i].getAvg() + ", ";
                potentialpltw += `<button id =  ${gradeArray[i].getAvg()} class = "buttonpltw" onclick="adjustap(${gradeArray[i].getAvg()})"> ${gradeArray[i].getAvg()}</button>`
                count++;
            }

         if (normal.substring(normal.length - 2, normal.length) == ", ")   
            normal = normal.substring(0, normal.length - 2);
         if (ap.substring(ap.length - 2, ap.length) == ", ")   
            ap = ap.substring(0, ap.length - 2);

        if (count === 0)
            document.getElementById("adjustpltw").style.display = "none";
        else
            document.getElementById("adjustpltw").style.display = "inline-block";
        document.getElementById("adjustpltw").innerHTML = potentialpltw
        document.getElementById("textmanual").style.display = "none"
        document.getElementById("gym").value = gym
        document.getElementById("AP").value = ap
        document.getElementById("grades").value = normal
        
        if (document.getElementById("grades").value === "")
            document.getElementById("textclick").style.display = "none"
        avg();
        }
        else 
        {
            document.getElementById("faq").style.display = "block";

            document.getElementById("pupilpath").style.display = "block";
            document.getElementById("pl").style.display = "none";   
            document.getElementById("gradesHere").style.display = "none";    
            document.getElementById("textmanual").style.display = "block";     
 
            document.getElementById("gym").value = ""
            document.getElementById("AP").value = ""
            document.getElementById("grades").value = ""
        }
}



function avg()
{   
    var normGrades = strToArr(document.getElementById('grades').value);
    var gym = document.getElementById('gym').value;
    var APGrades = strToArr(document.getElementById('AP').value);

    var transcript = []
    var transcriptunweighted = []

    transcript = transcript.concat(normGrades)
    transcriptunweighted = transcriptunweighted.concat(normGrades)

    for (var i = 0; i < APGrades.length; i++)
    {
        transcriptunweighted = transcriptunweighted.concat(APGrades[i])
            APGrades[i] = APGrades[i] * 1.1
    }

    transcript  = transcript.concat(APGrades)

    if (parseFloat(gym) > 0)
    { 
        transcript =  transcript.concat( parseFloat(gym)/2 )
        transcriptunweighted =  transcriptunweighted.concat( parseFloat(gym)/2 )

        gymEntered = true
    }
    else
        gymEntered = false

    document.getElementById("gradesHere").innerHTML = "<center> <font class = \"nums\"> 100 Scale: " + roundTo2(calcAvg(transcript)) +
    "</font></center> <center> <font class = \"nums\"> 4.0 Scale: " + roundTo2(calcAvg(to4point0(transcriptunweighted, APGrades.length)))+ "</font></center>";
}

function calcAvg(nums)
{
    var sum = 0;
    var invalid = 0;

    for (var i = 0; i < nums.length; i++)
    {
        if (nums[i] !== "" && nums[i] !== ",")
            sum += parseFloat(nums[i])
        else
            invalid++ 
    }

    if  (sum == 0)
        return "0"
    if (gymEntered)
        invalid += 0.5;

    sum /= (nums.length - invalid)
    return sum + ""
}

function manual()
{
    var button = document.getElementById("manual");
    if (button.style.display === "none")
    {
        button.style.display = "block";
        document.getElementById("manualbutton").innerHTML = "Hide"
    }
    else
    {
        button.style.display = "none";
        document.getElementById("manualbutton").innerHTML = "Manual Input"
    }
}

function strToArr(nums)
{
    if (nums === "")
        return []
    var numArray = nums.split(",");
    for (var i = numArray.length; i > -1 ; i--)
    {
        numArray[i]= parseFloat(numArray[i])
        if (numArray[i] + "" == "NaN")
            numArray.splice(i, 1)
    }
    return numArray
}

function to4point0(arr, numAPs)
{

    if (gymEntered && isNum(arr[arr.length-1]))
        arr[arr.length-1] *= 2
    else if (gymEntered)
        arr[arr.length-2] *= 2
    for(var i = 0; i < arr.length; i++)
        if (arr[i] >= 93)
            arr[i] = 4
        else if (arr[i] >= 90)
            arr[i] = 3.7
        else if (arr[i] >= 87)
            arr[i] = 3.3
        else if (arr[i] >= 83)
            arr[i] = 3
        else if (arr[i] >= 80)
            arr[i] = 2.7
        else if (arr[i] >= 77)
            arr[i] = 2.3
        else if (arr[i] >= 73)
            arr[i] = 2
        else if (arr[i] >= 70)
            arr[i] = 1.7
        else if (arr[i] >= 67)
            arr[i] = 1.3
        else if (arr[i] >= 65)
            arr[i] = 1
        else if (arr[i] >= 0)
            arr[i] = 0
        else;
    if (gymEntered && isNum(arr[arr.length-1]))
        arr[arr.length-1] /= 2
    else if (gymEntered)
        arr[arr.length-2] /= 2
    if (numAPs > 0)
        arr[0] += numAPs
    return arr
}

class Grade
{
    constructor(avg, type)
    {
        if (avg > 100)
            avg = 100
        this.avg = avg
        this.type = type
    }
    getAvg() {return this.avg}
    getType() {return (this.type)}
    setType(str) {this.type = str} 
    setAvg(str) {this.avg = avg}
    calcGrade()
    {
        if (this.type == "gym")
            return this.avg/2
        else if (this.type == "ap")
            return this.avg * 1.1
        return this.avg 
    }

    toString()
    {
        return "Average" + this.avg + " Weight:" + this.type        
    }
}


function adjustap(i)
{          
    var str = document.getElementById("grades").value
    var pos = str.indexOf(i+", ")        
    if (pos === -1)
        pos = str.indexOf(", "+ i)     

        document.getElementById("grades").value = str.substring(0, pos) + str.substring(pos + (i + "").length + 2) 
    document.getElementById("AP").value = document.getElementById("AP").value + ", " + i
    document.getElementById(i).style.display = "none"

    if (document.getElementById("grades").value === "")
    {
        document.getElementById("adjustpltw").style.display = "none"
        document.getElementById("textclick").style.display = "none"
    }
    avg()
}

function determineWeight(str, start, end)
{

    if ( str.substring(start, end+1).toUpperCase().indexOf("PHYSICAL EDUCATION") > 0)
        return "gym"
    else if ((str.substring(start, end+1).toUpperCase().indexOf("AP ")) >0)
        return "ap"
    if ( str.substring(start, end+1).toUpperCase().indexOf("LAB") > 0)
        return "none"
    if ( str.substring(start, end+1).toUpperCase().indexOf("ADVISORY") > 0)
        return "none"
    return ""
}

function findNums(str, start)
{
    var i = start
    while (i < str.length)
        if (isNum(str.substring(i, i+1)))
            break
        else
            i++
    start = i 
    i++

    while (isNum(str.substring(start,i)) && i < str.length+1)
        i++   
    return parseFloat(str.substring(start, i-1))
}

function isNum(str)
{
    return parseFloat(str) == str
}

function roundTo2(num)
{
    return Math.round(num*100) / 100
}
