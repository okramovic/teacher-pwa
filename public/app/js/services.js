app
.service('testShare',function(){

     const shared = {}

     // for sharing of current Dictionary
     this.getWords = function(){
          return shared.words
     }
     this.setWords = function(array){
          shared.words = array
     }

     // to be able to do previous test again
     this.setPrevTest = function(test){
               shared.prevTest = test
     }
     this.getPrevTest = function(){
               if (Array.isArray(shared.prevTest) && shared.prevTest.length > 0) return shared.prevTest
               else return null
     }
     })
.service('voiceLoader',['$timeout',function($timeout){

     // auto-selects voices for EN, DE and CS
     this.autoChooseVoices = function autoChooseVoices(){
               //console.log('autoChooseVoices =>',this.voices) 
               console.log('[this.lang1, this.lang2]',this.lang1, this.lang2)
     
               var self = this
     
               let languages = [this.lang1, this.lang2]
     
               languages.forEach(function(lang, ind){
             
                             if (lang === 'cz' ){
                                     self.defaultVoiceIndexes[ind] = self.voices.findIndex(function(voice){
                     
                                                     return voice.lang.toLowerCase().includes('cz') || voice.lang.toLowerCase().includes('cs')
                                                     })                
             
                             } else if (lang === 'en'){
             
                                     self.defaultVoiceIndexes[ind] = self.voices.findIndex(function(voice){
                     
                                                                     return voice.lang.toLowerCase().includes('gb') //|| voice.lang.toLowerCase().includes('cs')
                                                                     })
                             } else if (lang === 'de'){
     
                                     self.defaultVoiceIndexes[ind] = self.voices.findIndex(function(voice){
                     
                                                                     //console.log(voice.name)
                                                                     return voice.name ==="Google Deutsch"  || 
                                                                            voice.name === "German Germany" ||
                                                                            voice.lang.startsWith('de')
                                                                     })
                             }
               })
               console.log('this.defaultVoice1Index', this.defaultVoiceIndexes)
     
               this.defaultVoice1 = this.voices[this.defaultVoiceIndexes[0]]
               this.defaultVoice2 = this.voices[this.defaultVoiceIndexes[1]]
               console.log('default voices:',this.defaultVoice1, this.defaultVoice2)
     }
     }])
/*.service('vocabfile', [function(){

          this.parseText = parseText
     }])*/
.service('downloader', ['$timeout','$window',function($timeout,$window){


          // to get txt file with dictionary and progress
          this.downloadDict = function downloadDict(notes, newTab){
                        
               // for file saving, have languages to their original order
                    let lang1, lang2
                    if (this.direction=='ba'){
                         //console.log(this.direction, ' = ba?')
                         lang1 = this.lang2
                         lang2 = this.lang1
                    } else{
                         //console.log(this.direction, ' = ab?')
                         lang1 = this.lang1
                         lang2 = this.lang2
                    }

               // save it as file
                    if (!newTab){
                        //console.log('using Services line 34')
                        if (!notes) notes = ""

                        if ( !this.currentFilename.endsWith('.txt')) this.currentFilename += '.txt'

                        let url = $window.URL || $window.webkitURL

                        let data = [[lang1, lang2],
                                     ...this.words]
                                     .map(function(word){
                                        return word.join(". ")
                                     })

                        data =  "Your notes:\n\n" + notes + "\n\n" + 
                                "- - - (do not remove this line) - - -\n"  + 
                                data.join("\n")

                        

                        let blob = new Blob([data], {type: 'text/plain'})
                        this.myURL = url.createObjectURL(blob);

                        
                        let self = this
                        $timeout(()=>{
                              self.showUserNotes = false;
                        })
                        return
                    }

               // for browsers that don't allow downloads, 
               // or when text encoding doesnt help
               // open data in new tab so user can copy/paste back it up
                    let currentDate = this.dateIt().toString()
                    console.log('currentDate', currentDate)

                    let data = [[lang1, lang2], ...this.words]
                              .map( word => word.join(". ") )
                              .join('<br>')

                    data = '<br>' + currentDate +  `<br>
                           This is your current dictionary and progress.<br>
                           You can copy/paste it into a file and back it up.<br>
                           Place your notes here:<br>
                           <br>
                           - - - (do not remove this line) - - -<br>` + data

                    window.open("", "_blank").document.write(data);                    
          }
     }])
.service('exam', ['$timeout','$window',function($timeout,$window){

          this.prepareExam = prepareExam
          this.newRound = newRound
          this.changeLevel = changeLevel

          this.next = next
          this.home = home
          

          

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
                              //console.log('------  res  ------')
                              return res2
          }
          

          this.submit = function(ind, input, round, idk){
               console.log('     - - - -  new answ - - - - ')

               this.correct = correct
               this.okAnswer = okAnswer; this.badAnswer = badAnswer
               this.animateOk = animateOk; this.animateBad = animateBad

               this.blur= false

               const curWord = this.testQuestions[round],
                    dir = this.direction

                    
               // if answer is submitted && empty
               if (!idk && input.trim()==="") {
                         console.log('empty input')
                         this.blur= true
                         return
                         
                    // if user pressed 'IDK'
               } else if (idk) this.nextGo = 'next'
                    

               let from, to
                    
               if (dir==='ab'){ from = 0; to = 1
               } else if (dir==='ba'){ from = 1; to = 0 }  

               
               let self = this


               //speak().then(() => 
               new Promise( resolve =>{

                         var res = { dir: dir}
                         res.res = self.correct(input,curWord,round,to,from) 
                         console.log('result ',res.res)

                         if (res.res === 2) 
                              speak()
                                   .then(() => 
                                             $timeout(() =>
                                                  self.animateOk(()=>
                                                       $timeout(()=>{
                                                                 self.addRound = true
                                                                 resolve(res.res)
                                                       },750)     
                                                  )
                                             ,250)      
                                   )
                         else if (res.res === 1 && !self.zen){ 
                              console.log('result: 1  zen no')
                              $timeout(()=>{
                                   self.answerHide = false
                                   self.nextGo = "next"
                                   self.addRound = true
                              })

                              speak()
                                   .then(()=>
                                        $timeout(()=>
                                             self.animateOk(()=>

                                                  $timeout(()=>
                                                       resolve(res.res)
                                                  ,750)
                                             )
                                        ,250)
                              )
                         } else if (res.res === 1 && self.zen){
                              console.log('result: 1  zen active')
                              $timeout(()=>{
                                        self.answerHide = false
                                        self.nextGo = "next"
                                        self.addRound = false
                              })

                              speak()
                                   .then(()=>
                                        $timeout(()=>
                                             self.animateOk(()=>

                                                  $timeout(()=>
                                                       resolve(res.res)     
                                                  ,500)
                                             )
                                        ,500)
                                   )
                         } else if (res.res === 0 && !self.zen) {     
                                        console.log('0   zen no')
                                        $timeout(() => {
                                             self.answerHide = false
                                             self.nextGo ='next'
                                             self.addRound = true
                                        })

                                        speak()
                                        .then(() => $timeout(() => {
                                                            //self.addRound = true
                                                            self.animateBad()
                                                            resolve(res.res)
                                                    },400)
                                        )
                         } else if (res.res === 0 && self.zen) {     
                                        console.log('0 + zen active')
                                        $timeout(() => {
                                             self.answerHide = false
                                             self.nextGo ='next'
                                             self.addRound = false
                                        })

                                        speak()
                                        .then(() => $timeout(() => {
                                                            self.animateBad()
                                                            resolve(res.res)
                                                    },400)
                                        )
                         } else alert('error Promise\nresult >> ' + res.res + "<<")
               })
               //)
               .then(function(answer){ 
                    console.log('correct?', answer)

                         // possibilities:
                         //  1) ok answer & no zen  >>> ok point, next round, rating up
                         //  2) ok answer & zen     >>> ok point, next round, rating up
                         //  3) bad & no zen >>> add bad point, next round, rating down
                         //  4) bad & zen    >>> add bad point, repeat round, rating down


                    new Promise( res => {

                                   if (answer === 2) 
                                             // update currWord rating, add ok point, go to next round

                                             self.okAnswer( null,curWord,() => res(true) )

                                   else if (answer === 1 && !self.zen) 
                                             //  dont update any rating, add ok point, go next round

                                             self.okAnswer(true, curWord, () => res(true) )

                                   else if ((answer === 1 && self.zen) || (answer === 0 && self.zen) )
                                             //  down this word's rating, add bad point, stay in round

                                             self.badAnswer( true,curWord, input, () => res(false) )
                                   else 
                                             //  down this word's rating, add bad point, go next round

                                             self.badAnswer( false,curWord, input, () => res(true) ) 
                         })
                         .then(function(toNextRound){

                              self.endCheck(function(end){
                                   
                              if (end === true && toNextRound){ //console.log('end!! ', end)
                                                  
                                   $timeout(function(){
                                        self.showTest = false  // hide test container

                                        // if having 100% good score (different confetti)
                                        if (!self.feedback || self.feedback.length === 0){ console.log('self.feedback 0',self.feedback)

                                             $timeout(()=>{
                                                  self.finalResult = null // was 1  null is to not show wrong answers on next test start
                                                  startNewConfetti(7000,140)

                                                  self.$parent.$broadcast('endOfTest')
                                             },1000)

                                             $timeout(stopConfetti,7700)

                                             return
                                        }

                                        // if not 100% score
                                        $timeout(()=>{
                                                  self.finalResult = 1  // to show wrong answers
                                                  startNewConfetti(10000,110)
                                        },1000)
                                        $timeout(stopConfetti,10700)
                                                       
                                   }, 1500);
          
                              } else {

                                   if (self.nextGo === 'go')//{
                                        self.newRound()
                                        
                                   //} 
                                        /*else if(self.nextGo ==='next') {
                                        //alert("-next-")
                                   }   */            
                              }
                         })  
                         })
               })

               function speak(){
                    //console.log('speak started\n', this, self)
                    return new Promise( resolve => {

                         if (window.speechSynthesis && self.voice2On){

                                   let toSay = curWord.word[to]
                                   let utterThis = new SpeechSynthesisUtterance(toSay);
                                   utterThis.voice = self.voice2
                                   utterThis.lang = self.voice2.lang
                                   utterThis.onstart = function(ev){
                                        console.log('start speech')
                                   }
                                   utterThis.onpause = function(ev){
                                        console.log('speech pause')
                                   }
                                   utterThis.onend = function(ev){
                                             console.log('end speech')
                                             setTimeout(function(){
                                                  resolve()
                                             },100)               
                                   }
                                   utterThis.onerror = function(ev){ 
                                        console.error('speech error', ev); resolve() 
                                   }
                                   window.speechSynthesis.speak(utterThis);
                         } else resolve()
                    })
               }
          }
}])
//duration in milliseconds, best 10000 and 80 particles
function startNewConfetti(duration, particles){

     // enable animation frame requests to start
     window.confettiACTIVE = true;
     

     this.confetti = new Confetti({

                         width    : window.innerWidth,
                         height   : window.innerHeight,
                         length   : particles,
                         duration : duration
                    });
}
function stopConfetti(){
     

     this.confetti = null;

     let canvas = document.querySelector('canvas');
     canvas.classList.add('confettiHidden')
     
     setTimeout(()=>{
          // turn requestframe off!
          window.confettiACTIVE = false
          canvas.parentNode.removeChild(canvas);
     },2000)
     //console.log('canvas', canvas)
}



function next(){
     this.nextGo = 'go'
     this.newRound()
}
function home(){
     let self = this

     this.timeout(()=>{
          self.finalResult = null
          self.$parent.$broadcast('endOfTest')
     })
}
function okAnswer(zen,curWord,cb){
          let self = this

          // answer was 2 = super ok
          if (!zen) this.timeout(function updateProgress(){

                    self.oks ++
                    self.changeLevel(curWord,1)
                    if (cb) cb()
          },0)

          // answer was 1
          else this.timeout(function updateProgress(){

                    self.oks ++
                    if(cb) cb()
          }, 0)
}
function badAnswer(zen, curWord,input, cb){
        
        let self = this
        
        //if (zen) 
        this.timeout(function updateProgress(){
                
               self.answerHide = false
               self.bads ++

               self.changeLevel(curWord,-1)

               // new entry for test Feedback
                        let toFeedback = {original:curWord}

                        if (!input) toFeedback.input = '-'
                        else toFeedback.input = input

                        self.feedback.push(toFeedback)

               if (cb) cb()
        },0)
}
function animateOk(cb){

          let self = this
          this.anim_Oks = 'anim-ok live'

          this.timeout(()=>{
               self.anim_Oks = 'anim-ok'      
          },3500)

          if (cb) cb()
}
function animateBad(cb){

          let self = this
          self.anim_Bads = 'anim-bad live'

          this.timeout(()=>{
               self.anim_Bads = 'anim-bad'
          },3500)
    
          if (cb) cb()
}
// returns if user input was correct
function correct(input, word, round, to, from){
        
     // todo: make it so at least one non-article word is required as input

     //console.log('word', word)

     // indicates that IDK was pressed
     if (input.trim() ==="") return 0
     
     input = input.toLowerCase().trim()
     let w = word.word
     const ownIndex = word.ind


     if ( w[to].toLowerCase().includes(input) )  return 2

     else { //if (! w[to].toLowerCase().includes(input))
          

          let found = 0,      // result to be returned
              where = null    // index in Dict

          let originalWords = w[from]
                         .split(/,/g) 
                         .map(item => item.toString().toLowerCase().trim() )  // clear them, ignore Uppercases
          console.log( this.localWords )
          console.log("looking for", w[from], w[to])

          for (let i=0; i < this.localWords.length; i++){
               console.log(i, ownIndex)
               if (i === ownIndex) {  console.log('skipping', i, ownIndex);
                        continue;
               }     // to skip checking itself again

               if (i<=4) console.log(i, this.localWords[i] )
               
                    //  only look for answer in words that have same word on 'from' side //
                    
                    let dictWords_from = this.localWords[i][from].split(/,/g)

                    let hasSameFromWord = originalWords.some( word =>
                                
                              dictWords_from.some(w =>{
                                             console.log(word, w, w.toString().toLowerCase().trim() === word.toString().toLowerCase().trim() )
                                             // ignore emptySpace and upperCase noise
                                             return w.toString().toLowerCase().trim() === word.toString().toLowerCase().trim()
                                             })
                              )

               if (hasSameFromWord){
                    //return 1

                    console.log("cw check", dictWords_from,"fits", w[from])

                    // vocabulary word   
                    let targetDictWords = this.localWords[i][to]
                                        .split(/,/g)
                                        .map(w => w.toString().toLowerCase().trim() )
                    console.log('    targetDictWords', this.localWords[i][to])

                    // does this vocabulary word equal to input?   
                    let rslt = targetDictWords.some( word =>{ 
                                        //console.log(word, input)
                                        return word === input })

                    console.log('    rslt', rslt)
                    if (rslt === true) {

                                   found = 1;  where = i

                                   console.log("\n\nfound?",found,"alternative @", where, targetDictWords)
                                                        
                                   return found
                                   break
                    }
               }
               
               

               if (i === this.localWords.length - 1 ){
                         console.log("\n\nhavent found")
                         return found
               }       
          }
     }
     //else alert("correct Error")
}
// changes words knowledge level (rating)
function changeLevel(word, change){
        
     if (word.word[2]=== undefined || isNaN( parseInt(word.word[2]) )  )  word.word[2] = 0 + change
     else  word.word[2] = parseInt(word.word[2]) + change

     // keep word's rating in range from 0 to 6
     if (word.word[2]<0) word.word[2] = 0
     else if (word.word[2]>6) word.word[2] = 6
}
// to start new round
function newRound(string){
          console.log('round:',this.round,'current word:  ', this.testQuestions[this.round].word[0],this.testQuestions[this.round].word[1])

          let self = this
        
          this.timeout(()=>{
                    //console.log('this', this)
                    if (this.addRound) this.round ++

                    this.testWord = this.testQuestions[this.round].word[this.from] 
                    this.corrAnswer = this.testQuestions[this.round].word[this.to] 
                    this.answerHide = true
                
                    this.user.input = ""
                    this.blur = true    // actually auto-focuses the input

                    if (window.speechSynthesis && this.voice1On){
                                let toSay = this.testWord
                                let utterThis = new SpeechSynthesisUtterance(toSay);
                                utterThis.voice = this.voice1
                                utterThis.lang  = this.voice1.lang
        
                                window.speechSynthesis.speak(utterThis);
                    }
          })
}


/**
*   @param len is user-desired length of test
*/
function prepareExam (type,len,words,cb){
    
               console.log('its ',type,'test - length', len)


               let  taken = [],  // to prevent words being repeated
                    questions=[] // actual questions to be returned
    
               if (type === 'all words'){
    
                    if (len>words.length) len=words.length
    
                    // randomly chooses words from whole Dict
                    for (let i=0; i<len; i++){
                        
                        let found = false
    
                        while(!found) {
    
                            let ind = Math.floor(Math.random()*words.length)
    
                            if (taken.indexOf(ind)=== -1) {
                                        taken.push(ind)
                                        questions.push({
                                                        ind: ind,
                                                        word: words[ind]
                                                        })
                                        found = true
                            } //else found = false
                        } 
                    } 
                    console.log("questions\n", questions)
                    return questions
               } else if (type === 'newest'){

                         if (len>words.length) len=words.length

                         for (var i=0; i< len; i++){

                                let found = false
                                
                                while(!found) {
                                
                                        let ind = Math.floor(Math.random()*len)
                                
                                        if (taken.indexOf(ind)=== -1) {
                                                  taken.push(ind)
                                                  questions.push({
                                                                 ind: ind,
                                                                 word: words[ind]
                                                                 })
                                                  found = true
                                        } //else found = false
                                }
                         }
                         console.log("questions\n", questions)
                         return questions
               } else if (type === 'checked ones'){

                         let chosenW = []

                         len = this.slct.length

                         for (let i=0; i<len ; i++){
                                chosenW.push( this.words[this.slct[i]] )
                         }
                         // now words are ordered as in vocab - > shuffle them
                         for (let i=0; i<len; i++){

                                let found = false

                                while(!found) {
    
                                        let ind = Math.floor(Math.random()*chosenW.length)
                
                                        if (taken.indexOf(ind)=== -1) {
                                                        taken.push(ind)
                                                        questions.push({
                                                                        ind: ind,
                                                                        word: chosenW[ind]
                                                                        })
                                                        found = true
                                        }
                                }
                         }
                         console.log("questions\n", questions)
                         return questions
               } else if (type === 'unknown'){

                         let filtered = words.filter(function(item){

                                                  console.log(item)

                                             return item[2] === undefined
                         })

                         if (len>filtered.length) len=filtered.length
                        
                         for (let i=0;i<len; i++){
                                            
                                    let found = false
                        
                                    while(!found) {
                        
                                            let ind = Math.floor(Math.random()*words.length)
                                
                                            if (taken.indexOf(ind)=== -1) {

                                                        taken.push(ind)
                                                        questions.push({
                                                                ind: ind,
                                                                word: words[ind]
                                                                })
                                                        found = true
                                            }
                                    }    
                         } 
                         console.log('questions', questions)
                         return questions
               } else if (type === 'repeat previous'){

                        let prev = this.getPrevTest()
                        console.log('\n\n\nprevious questions',prev)

                        // change the order of questions so its different from previous one
                        
                        for (let i=0;i<prev.length; i++){
                                            
                            let found = false
                        
                            while(!found) {
                        
                                let ind = Math.floor(Math.random()*prev.length)
                        
                                if (taken.indexOf(ind)=== -1) {
                                            taken.push(ind);
                                            questions.push( prev[ind] );
                                            found = true;
                                } 
                            } 
                        } 
                        console.log('new questions', questions)
                        return questions
               }
}

/*
     // when opening new Dict, get only langs from input data
     function getLangs(string){

        let langs = stringToArr(string)[0]
        
        return {
                a: langs[0],
                b: langs[1]
               }
     }
     // return only words for vocab
     function parseText(string){
     return stringToArr(string).slice(1)
}*/

function stringToArr(str){

        let filteredArray = str.split(/\n/g)
        
        // filter out empty lines
        filteredArray = filteredArray
                         .filter(el => el.toString().trim() !== "")
                         .map(lineToArray)
        console.log('filteredArray', filteredArray)

        return filteredArray
}

function lineToArray(line){

        line = line.split(".")

        if (line[2]!=undefined && line[2].toString().trim() == "") line.pop()
        /*{
             let replacement = [line[0],line[1]]
             console.log('bad line repaired',replacement)
             return replacement.map(toProperType) 
             // or just do 
        }*/

        return line.map(toProperType)
}

// turn string numbers to Integers for proper word-rating changes
function toProperType(el){

        //if (el.toString().trim()==="") return undefined

        if ( isNaN(parseInt(el))===true ) return el.toString().trim()
        else return parseInt(el)
}

// used when saving progress to Local Storage
function mergeToSave(langs, words){
        
          let l = words.length
        
          let res = new Array(l+1)
          res[0] = langs

          for (let i = 0; i< words.length;i++){
        
                    res[i+1] = words[i]
          }
          return res
}




// modified confetti originally by https://codepen.io/kimmy/
class Progress {
     constructor(param = {}) {
       this.timestamp        = null;
       this.duration         = param.duration || Progress.CONST.DURATION;
       this.progress         = 0;
       this.delta            = 0;
       this.progress         = 0;
       //this.isLoop           = !!param.isLoop;
   
       this.reset();
     }
   
     static get CONST() {
       return {
         DURATION : 1000
       };
     }
   
     reset() {
       this.timestamp = null;
     }
   
     start(now) {
       this.timestamp = now;
     }
   
     tick(now) {
       if (this.timestamp) {
         this.delta    = now - this.timestamp;
         this.progress = Math.min(this.delta / this.duration, 1);
   
         if (this.progress >= 1 && this.isLoop) {
           this.start(now);
         }
   
         return this.progress;
       } else {
         return 0;
       }
     }
}
   
class Confetti {
     constructor(param) {
       this.parent         = param.elm || document.body;
       this.canvas         = document.createElement("canvas");
       this.ctx            = this.canvas.getContext("2d");
       this.width          = param.width  || this.parent.offsetWidth;
       this.height         = param.height || this.parent.offsetHeight;
       this.length         = param.length || Confetti.CONST.PAPER_LENGTH;
       this.yRange         = param.yRange || this.height * 2;
       this.progress       = new Progress({
         duration : param.duration,
         isLoop   : false
       });
       this.rotationRange  = typeof param.rotationLength === "number" ? param.rotationRange  : 10;
       this.speedRange     = typeof param.speedRange     === "number" ? param.speedRange : 10;
       this.sprites        = [];
   
       this.canvas.style.cssText = [
         "display: block",
         "position: absolute",
         "top: 0",
         "left: 0",
         "pointer-events: none",
         "z-index: 1"
       ].join(";");
   
       this.render = this.render.bind(this);
   
       this.build();
   
       this.parent.appendChild(this.canvas);
       this.progress.start(performance.now());
   
       // otherwise animation continues invisibly
       if (window.confettiACTIVE === true) requestAnimationFrame(this.render);
     }
   
     static get CONST() {
       return {
           SPRITE_WIDTH  : 9,
           SPRITE_HEIGHT : 16,
           PAPER_LENGTH  : 1000,
           DURATION      : 8000,
           ROTATION_RATE : 50,
           COLORS        : [
             "#EF5350", // okr
             "#EC407A", // magentish
             "#AB47BC", // purple 
             "#7E57C2",
             "#5C6BC0",
             "#42A5F5",
             "#29B6F6",
             "#26C6DA",
             "#26A69A",
             "#66BB6A",
             "#9CCC65",
             "#D4E157",
             "#FFEE58",
             "#FFCA28",
             "#FFA726",  // light orange
             "#FF7043",  // orange
             //"#8D6E63",// brown
             "#BDBDBD"   // light gray
             //"#78909C" // gray bluish
           ]
       };
     }
   
     build() {
       for (let i = 0; i < this.length; ++i) {
         let canvas = document.createElement("canvas"),
             ctx    = canvas.getContext("2d");
   
         canvas.width  = Confetti.CONST.SPRITE_WIDTH;
         canvas.height = Confetti.CONST.SPRITE_HEIGHT;
   
         canvas.position = {
           initX : Math.random() * this.width,
           initY : -canvas.height - Math.random() * this.yRange
         };
   
         canvas.rotation = (this.rotationRange / 2) - Math.random() * this.rotationRange;
         canvas.speed    = (this.speedRange / 2) + Math.random() * (this.speedRange / 2);
   
         ctx.save();
           ctx.fillStyle = Confetti.CONST.COLORS[(Math.random() * Confetti.CONST.COLORS.length) | 0];
           ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.restore();
   
         this.sprites.push(canvas);
       }
     }
   
     render(now) {
       //console.log('render', new Date().getSeconds()); 
       let progress = this.progress.tick(now);
   
       this.canvas.width  = this.width;
       this.canvas.height = this.height;
   
       for (let i = 0; i < this.length; ++i) {
         this.ctx.save();
           this.ctx.translate(
             this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
             this.sprites[i].position.initY + progress * (this.height + this.yRange)
           );
           this.ctx.rotate(this.sprites[i].rotation);
           this.ctx.drawImage(
             this.sprites[i],
             -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
             -Confetti.CONST.SPRITE_HEIGHT / 2,
             Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
             Confetti.CONST.SPRITE_HEIGHT
           );
         this.ctx.restore();
       }

     // to be able to turn it off via global state
     if (window.confettiACTIVE === true) requestAnimationFrame(this.render);
     }
}