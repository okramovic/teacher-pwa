app.service('exam', ['$timeout',function($timeout){
    
        this.prepareExam = prepareExam


        var x// = {a:"a", b:"b"}
        this.shared = x

        this.makeTest = function(words, indexes){
    
    
    
                            indexes.sort()
                            var res =  words.map(function(w,i){
    
                                    var r = w
                                    if (indexes.indexOf(i)!==-1) {
    
                                            r[2]=(i)
                                            return r
                                    } //else {}
                                    
                            })
                            res2 = res.filter(function(el){
                                    return el!== undefined
                            })
                            console.log('------  res  ------')
                            //console.log(res)
                            return res2
        }
        this.newRound = newRound
        
        this.next = next
        this.home = home
        this.changeLevel = changeLevel

        this.changeNextGo = changeNextGo
        this.getNextGo = getNextGo


        //this.
        //changeNextGo('abrakadabra')

        this.submit = function submit(ind,input, round, idk){
                console.log('     - - - -  new answ - - - - ')
                //console.log('>>>', ind, input,"round", round)
                //this.changeNextGo('mamuska')
                //$timeout(function(){
                        //console.log('this.nextgo',this.nextGo)
                //},1000)
                
                //this.nextGo = ""
                //console.log('gogogog', this.getNextGo())
                
                this.okAnswer = okAnswer; this.badAnswer = badAnswer

                this.animateOk = animateOk
                this.animateBad = animateBad
                
                this.blur= false

                this.correct = correct
                //console.log("this", this)

                let zis = this

                var curWord = this.testQuestions[round],
                    dir = this.direction

                
                // if answer is submitted && empty
                if (!idk && input.trim()==="") {
                        console.log('empty input')
                        this.blur= true
                        return

                }  else if (idk){

                        //alert('idk')
                        this.changeNextGo('next')

                        console.log(this)

                }

                let from, to;
                
                if (dir==='ab'){ from = 0; to = 1
                } else if (dir==='ba'){ from = 1; to = 0 }  


                console.log("voice2On?", this.voice2On )
                if (this.voice2On){

                        let toSay = curWord.word[to]
                        let utterThis = new SpeechSynthesisUtterance(toSay);
                        utterThis.voice = this.voice2//zis.voices[64];
                        //utterThis.onstart = function(){}
                        //utterThis.lang = "de-DE"
                        this.synth.speak(utterThis);
                }
                /*else if (idk && !this.zen){
                       // console.log('idk 1, no zen')
                        // speak, bad point ++, change rating, next round
                        //this.badAnswer(false,curWord)
                        //return

                } else if (idk && this.zen){
                        //console.log('idk 2')

                        // speak, bad point ++, change rating, keep same round

                        //zis.badAnswer(true,curWord)
                        //return

                }*/
                                

                this.p2 = new Promise(function(resolve, reject){
                            
                        //console.log("zis? >>", zis)

                        


                            var res = { dir: dir}
                            res.res = zis.correct(input,curWord,round,to,from) 

                            
                        

                            

                        /* if okay answer >> animate, 
                                             after she speaks, next round

                           if bad answer  >> animate & show next button,
                                             speak

                                             on next click newround

                        */
                        //utterThis.onend = function(){
                                //setTimeout(function(){
                                    //console.log('end speech')  
                                    
                                //},500)     
                        //}    

                        if (res.res === 2) { 
                                //console.log('anim start', res.res)
                                zis.answerHide = true
                                zis.animateOk(function(){

                                       // utterThis.onend = function(){
                                                console.log('end speech')    

                                                zis.timeout(function(){

                                                        resolve(res.res)
                                                },500)
                                                
                                        //}
                                        
                                })
                        } else if (res.res === 1 && !zis.zen){

                                console.log('1 + no-zen')

                                $timeout(function(){
                                        //zis.nextGo = "go"
                                        //zis.answerHide = true
                                        zis.nextGo = "next"
                                        zis.answerHide = false
                                })

                                zis.animateOk(function(){

                                        //utterThis.onend = function(){
                                                console.log('end speech')    

                                                zis.timeout(function(){

                                                        resolve(res.res)
                                                },500)
                                                
                                        //}
                                })


                        } else if (res.res === 1 && zis.zen){
                                    console.log('1 + zen')

                                    zis.animateBad(function(){

                                        $timeout(function(){
                                                zis.nextGo = "next"
                                                zis.answerHide = false
                                                 
                                        })
                                        resolve(res.res)

                                    })                                    
                                    

                        } else if (res.res === 0) {     
                                    console.log('\n\n  idk or 0')
                                    //console.log('this', this)
                                    //resolve(res.res)
                                    
                                    zis.animateBad()

                                    $timeout(function(){
                                       zis.changeNextGo('next')// = "next"
                                       zis.answerHide = false
                                    })
                                    
                                    resolve(res.res)  
                                    
                                    $timeout(function(){
                                        //alert(zis.getNextGo())
                                    },1000)

                                    //zis.$apply()
                        }
                        

                        //console.log(utterThis)
                        //zis.synth.speak(utterThis);
                            
                            

                })
                setTimeout(function(){
                        //console.log('this.nextGo check',this.nextGo)
                },2000)
                
                this.p2.then(function(answer){

                        console.log('correct?', answer)//, curWord)

                    //
                        //console.log(this)
                        // possibilities:
                        //  1) ok answer & no zen  >>> ok point, next round, rating up
                        //  2) ok answer & zen     >>> ok point, next round, rating up
                        //  3) bad & no zen >>> add bad point, next round, rating down
                        //  4) bad & zen    >>> add bad point, repeat round, rating down

                    var prms = 
                    new Promise(function(res,rej){

                                if (answer === 2) {
                                        
                                        // update currWord rating, add ok point, go to nextround

                                        zis.okAnswer(null,curWord, function(){

                                                res(2)
                                        })

                                } else if (answer === 1 && !zis.zen) 

                                        //  dont update any rating, add ok point, go next round

                                        zis.okAnswer(true, curWord, function(){
                                                //zis.answerHide = false
                                                res(2)
                                        })

                                else if ((answer === 1 && zis.zen) || (answer === 0 && zis.zen) )

                                        //  down this word's rating, add bad point, stay in round

                                        zis.badAnswer(true,curWord, input, function(){
                                                
                                                res(0)
                                        })           
                                else {
                                        //  down this word's rating, add bad point, go next round

                                        zis.badAnswer(false,curWord, input, function(){
                                                
                                                res(0)
                                        })
                                } 
                    })
                    prms
                    .then(function(res){
                        console.log('|||||||    resolved', res)

                        zis.endCheck(function(end){
                                //console.log('end?', end)

                                if (end === true){
                                        
                                        //setTimeout
                                        $timeout(function(){
                                                zis.finalResult = 1         
                                                zis.showTest = false
                                                console.log('zis.finalResult', zis.finalResult)

                                                if (!zis.feedback || zis.feedback.length===0){
                                                        console.log('zis.feedback',zis.feedback)
                                                zis.$parent.$broadcast('endOfTest')
                                                //zis.screen = null
                                                }
                                        }, 3000)
        
                                } else if (end === false){
        
                                        //console.log('res?', res)
                                        console.log(' o o o o o zis.nextGo',zis.getNextGo())

                                        if (zis.nextGo === 'go'){
                                                //alert('free to go')
                                                zis.newRound();
                                        
                                        } else if(zis.nextGo ==='next') {
                                                //alert("-next-")
                                        }
                                        //setTimeout(function(){
                                        if (res === 2) {}//zis.newRound();
                                        else {
                                                //alert('something goin on')
                                        }
                                        //}, 3000)
                                        
                                }


                        })  

                    })
                })
        }


}])
.service('vocabfile', [function(){

        //this.upload = upload
        this.parseText = parseText
}])
/*var promise = new Promise(function(resolve, reject){
        let res = correct(input,ind) 
        resolve(res)
})*/
function changeNextGo(str){

        //console.log( "this $timeout", $timeout)
        console.log('changing nextGo to=',str)
        //
        //this.timeout(function(){

                this.nextGo = str
        //})
        //let zis = this
        //this.$apply(function(){
        //        zis.nextGo = str
        //})

}
function getNextGo(){
        return this.nextGo
}
function next(){
        console.log('\\\\\\\ next  ///////')
        //alert('\\\\\\\ next  ///////')

        //console.log(this)

        this.nextGo = 'go'
        //this.$emit('blurit',true)
        this.newRound()

}
function home(){
        console.log('home')
        let zis = this

        this.nextGo = 'go'
        this.finalResult = null
        this.showTest = false
        this.timeout(function(){
                
        },0)
        //zis
        this.$parent.$broadcast('endOfTest')
        //this.$apply()        
}
function okAnswer(zen,curWord,cb){
        //console.log("updatescore this")
        //console.log(this)
        //-------

        //this.animateOk = animateOk
        //this.animateOk()

        let zis = this

        // answer was 2 = super ok
        if (!zen)
        this.timeout(function updateProgress(){

                zis.oks ++
                zis.round ++
                zis.changeLevel(curWord,1)
                if (cb) cb()
        },0)

        // answer was 1
        else this.timeout(function updateProgress(){

                zis.oks ++
                zis.round ++;
                if(cb) cb()
        }, 0)

        

}
function badAnswer(zen, curWord,input, cb){
        //console.log("updatescore this")
        //console.log('$timeout', $timeout)
        //this.animateBad = animateBad
        let zis = this
        //this.animateBad()

        //console.log( this.corrAnswer , "hide?", this.answerHide)
        //console.log("wrong answers",this.feedback)

        //this.$apply()
        if (zen) this.timeout(function updateProgress(){

                zis.answerHide = false
                
                zis.answerHide = false
                zis.bads ++
                //zis.round ++
                zis.changeLevel(curWord,-1)

                        let toFeedback = {original:curWord}

                        if (!input) toFeedback.input = '-'
                        else toFeedback.input = input

                        zis.feedback.push(toFeedback)
                //console.log('zis.round',zis.round)
                if (cb) cb()
        },0)

        else this.timeout(function updateProgress(){

                zis.answerHide = false

                zis.bads ++
                zis.round ++
                zis.changeLevel(curWord,-1)

                        let toFeedback = {original:curWord}

                        if (!input) toFeedback.input = '-'
                        else toFeedback.input = input

                        zis.feedback.push(toFeedback)
                //console.log('zis.round',zis.round)
                if (cb) cb()                
        })
}
function animateOk(cb){
        //console.log('anim ok')
        let zis = this
        this.anim_Oks = 'anim-ok live'
        //console.log(this.anim_Oks)

        this.timeout(function(){
                zis.anim_Oks = 'anim-ok'
                //console.log(zis.anim_Oks)
        },3500)

        if (cb) cb()
}
function animateBad(cb){

        //console.log('anim bad')
        //console.log($timeout)
        //console.log('this', this)
        let zis = this
        zis.anim_Bads = 'anim-bad live'

        this.timeout(function(){
                //console.log('end anim', this.anim_Bads, "<<")
                
                zis.anim_Bads = 'anim-bad'
        },3500)
        //this.$apply(function(){})
        if (cb) cb()
}
function correct(input, word, round, to, from){
        
        // how to make it so at least main word is required as input
        //console.log('zis.words', this)//zis.words)

        console.log('word', word)

        if (input.trim() ==="") return 0

        let w = word.word //, from, to
        const INDEX = word.ind
        //if (dir==='ab'){ from = 0; to = 1
        //} else if (dir==='ba'){ from = 1; to = 0 }

        if (w[to].toLowerCase().includes(input.toLowerCase())) {
                console.log("found directly = ",2)

                return 2
        }

        else if (! w[to].toLowerCase().includes(input.toLowerCase())){

                let found = 0, where = null

                let thisWord = w[from].split(/,/g) 

                                // clear them, ignore Uppercases
                                .map(function(item){ return item.toString().toLowerCase().trim()})

                console.log("thisWord", thisWord)


                for (let i=0; i < this.localWords.length; i++){

                        //console.log('INDEX 22', INDEX)

                        // skip checking itself again
                        if (i === INDEX) continue

                        let dictWord = this.localWords[i][from].split(/,/g)            //toString().toLowerCase().trim()


                        //  only look for answer in words that have same word on from side
                        
                        let fits = thisWord.some(function(word, ind){
                                
                                        return dictWord.some(function(w){

                                                        // ignore emptySpace and upperCase noise
                                                return w.toString().toLowerCase().trim() 
                                                        === word.toString().toLowerCase().trim()
                                        })

                                        //return dictWord.includes(word)
                                    })

                        



                        if (fits){

                             console.log("cw check", dictWord,"fits", fits, input)

                             // vocabulary word   
                             let word = this.localWords[i][to].split(/,/g)
                                
                                        
                                        .map(function(w){ return w.toString().toLowerCase().trim()})
                                
                                
                             console.log("     -  ", word)           
                             // does this vocabulary word equal to input?   
                             if (word.some(function(w, ind){

                                                   return w === input.toLowerCase().trim()

                                        }) === true) {

                                        //console.log("found this:", word)
                                        found = 1; 
                                        where = i

                                        console.log("found?",found,"alternative @", where, word)
                                                        
                                        return found
                                        break
                             }


                        }            
                        
                        if (i === this.localWords.length -1 ){

                                console.log("havent found",found,"alternative @", where)
                                
                                return found

                        }

                        
                }

                
        }
        else alert("correct fn Error")

    //let i = this.round
        //console.log( this)//testQuestions[i])
        /*console.log( this.testQuestions[i][0].includes(
                this.testQuestions[i][1]
        ))*/

    
}
function changeLevel(word, change){
        //console.log('change level')
        //console.log('bef',word.word, change)
        //console.log( this.words )

        if (word.word[2]=== undefined){
                word.word[2] = 0 + change

                

                //this.words[word.ind][2] = 0
                //console.log('newly',word.word,'index', word.ind)
                //this.$parent.$broadcast('updateWord', word)

        } else if (word.word[2]!== undefined){

                word.word[2] += change
                //console.log('newly',word.word,'index', word.ind)
        }

        if (word.word[2]<0) word.word[2] = 0
        else if (word.word[2]>6) word.word[2] = 6

        //this.$parent.$broadcast('updateWord', word)
        
}
function newRound(string){
        //console.log('from:',  this.from)
        if (string ==='first' ) {this.round=0; string = null;
                
        }

        else if (!string){ //this.round ++;
                //this.blr ++
                //alert('blr')
        }

        this.blur = true//!this.blur
        this.focusIt = function bb(){
                //this.$parent.$broadcast('blurit')
        }
        //this.focusIt()

        console.log('rounds', this.round)//, this.testQuestions[0].word)
        console.log('current word:  ', this.testQuestions[this.round].word[0],this.testQuestions[this.round].word[1])
        //console.log("inpVal",this.inpVal," || ", this.user.input,"<<<")
        this.testWord = this.testQuestions[this.round].word[this.from] 
        this.corrAnswer = this.testQuestions[this.round].word[this.to] 
        this.answerHide = true

        this.user.input = ""

        if (this.round===0) this.$apply()

        console.log('this.voice1On',this.voice1On, this.testWord)

        if (this.voice1On){

                        let toSay = this.testWord//curWord.word[to]
                        let utterThis = new SpeechSynthesisUtterance(toSay);
                        utterThis.voice = this.voice1//zis.voices[64];
                        //utterThis.onstart = function(){}
                        //utterThis.lang = "de-DE"
                        this.synth.speak(utterThis);
                }
        
}
function prepareExam (type,len,words,cb){
    
                console.log('its ',type,'length', len)
                let taken = [],questions=[]
    
                if (type=== 'all words'){
    
                    if (len>words.length) len=words.length
    
                    for (let i=0;i<len; i++){
                        
                        let found = false
    
                        while(!found) {
    
                            let ind = Math.floor(Math.random()*words.length)
                            //console.log(ind, taken.indexOf(ind));
    
                            if (taken.indexOf(ind)=== -1) {
                                        taken.push(ind)
                                        questions.push({
                                                        ind: ind,
                                                        word: words[ind]
                                                        })
                                        found = true
                            } else { found = false}
                        } 
                        
                        
                    } 
                    return questions
    
                    /*let promise = new Promise(function(res,rej){
                        setTimeout(function(){
                            res("Success!"); // Yay! Everything went well!
                          }, 1250);
                        })
                        promise.then(function(msg){
                            console.log(msg)
                        })*/
                        //if (cb) cb(questions)
                } else if (type === 'newest'){

                        if (len>words.length) len=words.length

                        for (var i=0; i< len; i++){

                                let found = false
                                
                                while(!found) {
                                
                                        let ind = Math.floor(Math.random()*len)
                                                        //console.log(ind, taken.indexOf(ind));
                                
                                        if (taken.indexOf(ind)=== -1) {
                                                taken.push(ind)
                                                questions.push({
                                                                ind: ind,
                                                                word: words[ind]
                                                                                })
                                                                found = true
                                        } else { found = false}
                                }
                                //questions.push({ind: i, word: words[i]})
                        }

                        return questions
                } else if (type === 'checked ones'){
                        let chosenW = []

                        console.log('this.slct', this.slct)

                        if (len>this.slct.length) len=this.slct.length

                        for (let i=0; i<len ; i++){

                                chosenW.push( { ind: this.slct[i], 
                                                word: this.words[this.slct[i]] })
                        }

                        console.log('chosenW', chosenW)
                        
                        words = chosenW

                        for (let i=0; i<len; i++){

                                let found = false

                                while(!found) {
    
                                        let ind = Math.floor(Math.random()*words.length)
                                        //console.log(ind, taken.indexOf(ind));
                
                                        if (taken.indexOf(ind)=== -1) {
                                                        taken.push(ind)
                                                        questions.push({
                                                                        ind: ind,
                                                                        word: words[ind]
                                                                        })
                                                        found = true

                                        } else { found = false
                                        }
                                }
                        }
                }
    
                // 'repeat previous','checked ones','everything','unknown','newest']
    
    }
function shared(val){
    
            //this.getVal = function(val){
    
                    console.log('= = = VAL = = =', val)
            //}
}

function upload(text){

        alert(' u z š č x p n + č š c í p á š n c p \n\n   link ' + text)
        
        //let zis = this

                //somewords = this.parseText(text)//, function(words){

        
                //this.mainScreen = true
                //console.log('this',this)
                //this.$digest()

        //this.
        /*$timeout(function(){
                console.log('this ||||/////',this)

                        zis.words = somewords
                        zis.mainScreen = 'aloha'
        },0)*/
        //this.$apply()
                /*console.log(this)
                console.log(zis)
                /*zis.$timeout(function(){
                },0)*/
        //})

}



function parseText(string){

        // 1) split str into arr
        // 2) get rid of empty lines
        // 3) make it have both "from" word && "to" word so errors 
        //        in practicing are prevented

        // get only words to vocab
        //console.log( stringToArr(string).slice(1) )        

        return stringToArr(string).slice(1)
}
function getLangs(string){

        let res = stringToArr(string)[0]
        //res = 
        //console.log(res)
        //res = res.slice(0,1)

        // get only langs

        return {
                a: res[0],
                b: res[1]
        }
}
function stringToArr(str){

        
        let filteredArray = str.split(/\n/g)
        
        filteredArray = filteredArray.filter(function(el){        

                return el.toString().trim() !== "" && el.split(".").length > 1

        })
        .map(function(el) {
                        //console.log('el', el)       

                        el = el.split(".")
                        el.map(function(el) {
                        
                                return el.toString().trim()

                        });
                        

                        return el
        
        })
        //console.log('filteredArray\n\n', filteredArray )
        return filteredArray

}
function mergeToSave(langs, words){

        let l = words.length

        let res = new Array(l+1)

        res[0] = langs

        //words.forEach(function(el,i){
        for (let i = 0; i< words.length;i++){

                res[i+1] = words[i]
        }

                
        //})

        return res
}