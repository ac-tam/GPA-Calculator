
    var tabledata;

    function onaload() {
        readCookie(document.cookie)

    }

    var keywords = ["", "", "", "", "", "", "", "", "", ""];
    var weights = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var credits = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    var creditCount = 0;


    function avc() {

        if (document.getElementById("edit").style.height == "300px") {
            document.getElementById("edit").style.height = "77px";
            document.getElementById("weights").style.display = "none    ";
        }
        else {
            document.getElementById("edit").style.height = "300px";
            document.getElementById("weights").style.display = "table";

        }
    }

    function addRow() {

        for (var i = 0; i < 10; i++) {
            keywords[i] = (document.getElementById(i + "x").value)
            weights[i] = (parseFloat(document.getElementById(i + "y").value))
            credits[i] = (parseFloat(document.getElementById(i + "z").value))
        }

        writeCookie()
    }

    function writeCookie() {
        document.cookie = `k=${keywords}=${weights}=${credits}`

    }
    var count = 0
    function readCookie(cookie) {
        if (cookie == "")
                    return ""
        var arrays = cookie.substring(2).split("=")
        keywords = arrays[0].split(",")
        weights = arrays[1].split(",")
        credits = arrays[2].split(",")

        for (var i = 0; i < weights.length; i++) {
            weights[i] = parseFloat(weights[i])
            credits[i] = parseFloat(credits[i])

        }



        for (var i = 0; i < 10; i++) {
            document.getElementById(i + "x").value = keywords[i]
            if ("" + weights[i] != "NaN")
                document.getElementById(i + "y").value = weights[i]
            if ("" + credits[i] != "NaN")
            document.getElementById(i + "z").value = credits[i]

        }
    }
    function manual() {
        var gradeArray = document.getElementById("manual").value.split(",")
        var sum = 0;
        var credits = 0
        var weight;
        for (var i = 0; i < gradeArray.length; i++) {
          gradeArray[i] += "([1)[1]"
          weight = parseFloat(gradeArray[i].substring(gradeArray[i].indexOf("(") + 1, gradeArray[i].indexOf(")") )) || 1
            sum += parseFloat(gradeArray[i].substring(0, gradeArray[i].indexOf("(")  + 1 ))  * weight
            credits += parseFloat(gradeArray[i].substring(gradeArray[i].indexOf("[" + 1, gradeArray[i].indexOf("]" + 1) + 1))) || 1
        }


    }

    function quick() {
        var str = document.getElementById("direct").value;
        if (str.length > 0) {
            var gradeArray = [];

            var start;
            for (var i = 0; i < str.length; i++)
                if (str.substring(i, i + 1) === ":")
                    if (str.substring(i, i + 4).indexOf(" -") < 0) {
                        gradeArray.push(new Grade(findNums(str, i), determineWeight(str, start, i)))
                        start = i + (gradeArray[gradeArray.length - 1].getAvg() + "").length
                        i = start
                    }
                    else {
                        i += 6;
                        start = i;
                    }
                    console.log(gradeArray)
                    console.log(creditCount)

        }
        var sum = 0;
        var noNan = []
        for (var i = 0; i < gradeArray.length; i++)
        {
            sum += gradeArray[i].getAvg() * gradeArray[i].getWeight()
        }


        document.getElementById("gradesHere").innerHTML  = sum/creditCount + ""



    }

    function findNums(str, start) {
        var i = start
        while (i < str.length)
            if (isNum(str.substring(i, i + 1)))
                break
            else
                i++
        start = i
        i++

        while (isNum(str.substring(start, i)) && i < str.length + 1)
            i++
        return parseFloat(str.substring(start, i - 1))
    }
    class Grade {
        constructor(grade, weight) {
            this.grade = grade;
            this.weight = weight;
        }

        getAvg() {return this.grade;}
        getWeight() {return parseFloat(this.weight);}
    }


    function determineWeight(str, start, end) {
            for (var i = 0; i < keywords.length; i++)
            if (str.substring(start, end + 1).toUpperCase().indexOf("	" + keywords[i].toUpperCase() + " ") > 0 || str.substring(start, end + 1).toUpperCase().indexOf("	" + keywords[i].toUpperCase() + " ") > 0)
                {
                    creditCount += credits[i]
                    return weights[i]
                }
        creditCount += 1
        return 1

    }


    function isNum(str) {
        return parseFloat(str) == str
    }

    function roundTo2(num) {
        return Math.round(num * 100) / 100
    }

    function removeNaN(arr) {
        var newArr = [];
        for (var i = 0; i < arr.length; i++)
                if (arr[i] + "" != "NaN")
                    newArr.push(arr[i])
        return newArr
    }

    function sumArr(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++)
             sum += arr[i]

    return sum;

    }