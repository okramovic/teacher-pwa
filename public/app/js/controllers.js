app
.service('testShare',function(){

        var idk = [], direction = ''
        var shared = {}
        //this.shrd = new String()

        var words = []

        this.testQuestions = idk

        this.direction = direction

        this.getWords = function(){
                //console.log(";;;;;;;;;   this.shared words to send", shared.words)

                return shared.words
                //'mama tata'//this.
                
        }
        this.setWords = function(array){
                //this.
                shared.words = array

                //console.log(";;;;;;;;;   this.shared words", shared.words)
        }
        this.setPrevTest = function(test){
                shared.prevTest = test
        }
        this.getPrevTest = function(){
                if (Array.isArray(shared.prevTest) && shared.prevTest.length>0){
                        //alert ('there is previous test')
                        return shared.prevTest
                }
                
                else return null

        }
        this.setVal = function(val){
                idk = val
        }
        this.getVal = function(){
                return idk
        }
        this.endTest = function(){
                alert('end test')
        }

        this.updateWord = function(i, newWord){
                //console.log('updateWord')
                //this.words[ind] = newWord
                //console.log(this.words)
                //console.log('was', this.words[i])

                //console.log('now', newWord)
        }
})
.controller('teacherCtr',['$scope','$rootScope','$timeout',
                        '$window',
                        //'fileReader',
                        //'teacherService',
                        'exam', 'vocabfile', 'testShare',

function($scope, $rootScope, $timeout, 
                $window,//fileReader//,teacherService,
        exam,vocabfile, testShare){

                // add dropbox get file and upload file functionality to show off
                
    
                        //$window.localStorage.removeItem("_words_en_-_est")
                        //$window.localStorage.removeItem("userFileNames")
                        //$window.localStorage.removeItem("__ test.txt")  
                        //console.log($window.localStorage.getItem("_words_cz_-_de"))


                        //
                                //let xx= 
                                //console.log(  $window.localStorage.getItem("test")            )
                                //console.log(  $window.localStorage.getItem("userFileNames")   )
                                //console.log(  $window.localStorage.getItem("__ test.txt")     )
                                //console.log(  angular.fromJson($window.localStorage.getItem("_words_en_-_est") ))
                                //console.log(     )

            // alert("width " + window.innerWidth)

            $scope.$timeout = $timeout
        
            function loadVoices(){
                if (window.speechSynthesis) {

                                var synth = window.speechSynthesis;
                        

                                // promisify this
                                $timeout(function(){
                                        $scope.defaultVoiceIndexes = [null, null]
                                        $scope.voices = []
                                        $scope.voices = synth.getVoices();    
                                        console.log($scope.voices)

                                        $timeout(function(){

                                                [$scope.lang1, $scope.lang2].forEach(function(lang, ind){
                                                        console.log("lang", lang)
        
                                                        if (lang === 'cz' ){
                                                                $scope.defaultVoiceIndexes[ind] = $scope.voices.findIndex(function(voice){
                
                                                                                                                        //console.log(voice.lang.toLowerCase().includes('cz'))
                                                                                                                        return voice.lang.toLowerCase().includes('cz') || voice.lang.toLowerCase().includes('cs')
                                                                                                                        })
                                                                console.log('$scope.defaultVoice1Index', $scope.defaultVoiceIndexes)
        
                                                        } else if (lang === 'en'){
        
                                                                $scope.defaultVoiceIndexes[ind] = $scope.voices.findIndex(function(voice){
                
                                                                                                                        //console.log(voice.lang.toLowerCase().includes('cz'))
                                                                                                                        return voice.lang.toLowerCase().includes('gb') //|| voice.lang.toLowerCase().includes('cs')
                                                                                                                        })
                                                        } else if (lang === 'de'){

                                                                $scope.defaultVoiceIndexes[ind] = $scope.voices.findIndex(function(voice){
                
                                                                                                                        //console.log(voice.name)
                                                                                                                        return voice.name ==="Google Deutsch"  ||   voice.name === "German Germany"
                                                                                                                        })
                                                        }
        
        
                                                })
                                                $scope.defaultVoice1 = $scope.voices[$scope.defaultVoiceIndexes[0]]
                                                $scope.defaultVoice2 = $scope.voices[$scope.defaultVoiceIndexes[1]]


                                        }, 500)
                                        
                                        
                                        //$scope.defaultVoice1 = $scope.voices[0]
                                        //$scope.defaultVoice1Index = 0
                                        
                                        //$scope.defaultVoice2Index = 0 //6
                                        
                                        //$scope.defaultVoice1 = $scope.voices[$scope.defaultVoice1Index]


                                        /*var utterThis = new SpeechSynthesisUtterance('grüss gott grüss gott');
                                        utterThis.voice = $scope.voices[6];
                                        utterThis.lang = "de-DE"
                                        utterThis.onend = function(){
                                                console.log('end speech')
                                        }*/
                                        //console.log(utterThis)
                                        //synth.speak(utterThis);
                                }, 1200)
                }
            }
            //console.log('digest check')

            var userFile = {}
            $scope.chooseNew = false


            $scope.hasLocalStorage = function(){

                // let previousFilesNames
                // get all previously used vocab names (storage/filenames)
                // let user choose which last session to open

                let fns = $window.localStorage.getItem("userFileNames")
                //console.log("filenames in LS ", fns)
                return  fns !== null && fns !== undefined
            }
            

            function loadLocalStorage(){
                "use strict"
                        
                        let names = angular.fromJson(

                                        $window.localStorage.getItem("userFileNames")

                                        )
                        /*if (names!== null && names!== undefined)
                                names = names.map(function(item){
                                                return item.name
                                        })*/

                        
                        $timeout(function(){
                                if (names!== null) $scope.storedDicts = names
                                else $scope.storedDicts = []
                                $scope.mainScreen = true
                                
                                console.log("storage dicts\n",$scope.storedDicts)
                                //console.log('dict names', names)
                        })

                        
            }
            loadLocalStorage()


            $scope.loadLSDict = function(dict){
                        "use strict"

                        //console.log("dict to load", dict)

                        userFile.currentFilename = dict.toString()
                        

                        let data = angular.fromJson( $window.localStorage.getItem(dict) )
                                        .map(function(item) {

                                                item[0] = item[0].toString().trim()
                                                item[1] = item[1].toString().trim()
                                                if (item[2]) item[2] = parseInt(item[2])

                                                //console.log(item)
                                                return item
                                        });

                        //console.log("data", data)
                        

                        $timeout(function(){
                                $scope.lang1 = data[0][0], $scope.lang2 = data[0][1]
                                $scope.words = data.slice(1)
                                $scope.mainScreen = true
                                $scope.screen = "main"
                                $scope.currentFilename = userFile.currentFilename

                                $scope.setWords(data.slice(1))

                                //console.log("userFile.", $scope.currentFilename)
                                loadVoices()
                        })

            } 

            //$scope.
            function saveLocSto(newName,lang1, lang2,save){
                        "use strict"

                        
                        console.log("\n\n||||||| saving to local",newName, lang1, lang2)
                        //   look for this name in filenames storage
                        //      if its not there set it
                        //      if its there..
                if (newName && lang1 && lang2 && Array.isArray(save) && save.length>0){

                        console.log(" can save, have all data")

                        let savedFilenames = $window.localStorage.getItem("userFileNames")
                        

                        const toSave = mergeToSave([lang1, lang2], save)

                        //x.splice(0,0, [lang1, lang2] )
                        console.log('data to save \n\n', toSave)

                        if (!savedFilenames){

                                console.log("no stored filenames", savedFilenames)

                                let names = [  {name: newName, date: dateIt()}  ]
                                
                                $window.localStorage.setItem("userFileNames", angular.toJson(names))
                                console.log(  angular.toJson(names)  )

                                $window.localStorage.setItem(newName.toString(),
                                        angular.toJson( toSave )
                                )
                                // $scope.words.unshift( [lang1, lang2] )
                                // angular.toJson()
                                console.log("saving, words" , toSave)
                                //console.log("saving, words" , $scope.words)
                                


                        } else if (savedFilenames){

                                // is this filename already there?
                                savedFilenames = angular.fromJson(savedFilenames)
                                let isThere = false

                                for (let i=0; i< savedFilenames.length; i++){
                                        console.log(savedFilenames[i].name ,"vs", newName)


                                        if (savedFilenames[i].name === newName
                                                ) { 
                                                        isThere = true; break  }

                                }
                                console.log("is this file there?", isThere)
                               

                                if (!isThere) {


                                        savedFilenames.push({
                                                                name: newName.toString(),
                                                                date: dateIt()
                                                            }
                                                           )

                                        $window.localStorage.setItem("userFileNames", angular.toJson(savedFilenames))
                                        console.log("new filename saved to local storage", newName.toString() )

                                        $window.localStorage.setItem(newName.toString(),
                                                angular.toJson( toSave )
                                        )

                                        console.log("local storage file updated", newName.toString(),toSave.length)


                                } else if (isThere)
                                
                                        $window.localStorage.setItem(newName.toString(),
                                                angular.toJson( toSave )
                                        )
                                        console.log("local storage file updated")



                        }
                }

            }
            $scope.deleteLSDict = function(dict, ind){

                        if (confirm("sure to delete?\n\n" + dict)){

                                

                                let names = angular.fromJson(
                                        $window.localStorage.getItem("userFileNames")
                                )

                                //console.log("names", names)
                                
                                names.splice(ind, 1)
                                

                                console.log("delete index", ind, names)
                                //console.log("deleted", dict)

                                if (Array.isArray(names) && names.length>0){

                                        // save new index of dicts && del the dict
                                        $window.localStorage.setItem("userFileNames",
                                                                angular.toJson(names))

                                        console.log("userFilenames: ", $window.localStorage.getItem("userFileNames"))

                                } else if (Array.isArray(names) && names.length === 0){

                                        $window.localStorage.removeItem("userFileNames")
                                        console.log("userFilenames: ", $window.localStorage.getItem("userFileNames"))
                                }

                                $window.localStorage.removeItem(dict)

                                $timeout(function(){
                                        //$scope.storedDicts = $window.localStorage.getItem("userFileNames")
                                        $scope.storedDicts.splice(ind, 1);
                                        loadLocalStorage()
                                })
                        }
                        else return null
            }

            // when copy pasting
            $scope.uploadPasted =  function(txt){  //vocabfile.upload
                        "use strict"

                        console.log("pasting")
                        // for local storage: create new generic file name 
                        //      from langs in first line
                        //      + add current date

                        //$scope.
                        //const newwords = parseText(txt)
                        

                        let langs = getLangs(txt)
                        $scope.lang1 = langs.a
                        $scope.lang2 = langs.b
                        const WORDS  = parseText(txt)

                        console.log("langs", $scope.lang1, $scope.lang2)

                        if ($scope.lang1 == undefined || $scope.lang1 == "" || $scope.lang1 === null 
                            ||
                            $scope.lang2 == undefined || $scope.lang2 == "" || $scope.lang2 === null        
                        ){
                                alert("one of language indications is missing.\n" + 
                                      "fill it in please\n(in very first line)");
                                return
                        } else if (! Array.isArray(WORDS) || WORDS.length === 0 ){
                                alert("there seem to be no words in your vocab.\n" +
                                      "you'll need some to use this app");
                                return
                        }


                        userFile.currentFilename = "_words_" + langs.a.toString() + "_-_" + langs.b.toString()
                        $scope.currentFilename = userFile.currentFilename
                        //mergeToSave([ $scope.lang1, $scope.lang2 ],)

                        console.log("WORDS", WORDS)
                        console.log("uploading words fun:", userFile.currentFilename)//,"langs:", langs)


                        $scope.idk = "1 4 2 3"
                        //$scope.$broadcast('newDict', parseText(txt))
                        
                        $timeout(function(){
                                        $scope.words = WORDS//parseText(txt)
                                        $scope.setWords(WORDS)

                                        $scope.mainScreen = true
                                        $scope.screen = "main"

                                        // to hide open file / copy-paste div on initial screen
                                        $scope.chooseNew = false
                                        loadVoices();
                                        
                        },0)
                        //$scope.
                        saveLocSto(userFile.currentFilename, $scope.lang1, $scope.lang2, WORDS)
                        loadLocalStorage()
            }


            // when using fileReader
            $scope.$on('newDict', function(e,d){
                        "use strict"

                        console.log("new data")
                        // get fileName and store it into local storage under key userFileNames

                        //alert('oh ma')
                        //,e, "\ndata\n", "is array?",Array.isArray(d.words))

                        
                        /*let ts2 = d.words.map(function(el){

                                return el.join(". ")
                        })
                        let toStore = '- - - (do not remove this line) - - -' + 
                                        '\n' + 
                                        ts2.join("\n")*/
                        const WORDS = d.words

                        if (d.langs.a == undefined || d.langs.a == "" || d.langs.a === null 
                            ||
                            d.langs.b == undefined || d.langs.b == "" || d.langs.b === null        
                        ){
                                alert("one of language indications is missing.\n" + 
                                      "fill it in please\n(in very first line)");
                                return

                        } else if (! Array.isArray(WORDS) || WORDS.length === 0 ){
                                alert("there seem to be no words in your vocab.\n" +
                                      "you'll need some to use this app");
                                return
                        }

                        
                        //$timeout
                        //(function(){

                                
                                //console.log('userFile', userFile)
                                //$scope.idk = ".. 1 4 2 3 .."
                                
                        //})
                        console.log(d)
                        $scope.$apply(function(){
                                userFile.currentFilename = d.filename
                                $scope.currentFilename = userFile.currentFilename
                                $scope.storedDicts.push(d.filename)
                                $scope.words = d.words
                                $scope.lang1 = d.langs.a
                                $scope.lang2 = d.langs.b
                                $scope.screen = "main"
                                loadVoices();

                                $scope.setWords(d.words)

                                // to hide open file / copy-paste div on initial screen
                                $scope.chooseNew = false
                        })

                        //$scope.
                        saveLocSto(userFile.currentFilename, 
                                   $scope.lang1, $scope.lang2, WORDS)
                        loadLocalStorage()
                    
            })

            $scope.loadExample = function(){ 
                $timeout(function(){
                        $scope.words = $scope.example2
                        $scope.lang1 = 'en'
                        $scope.lang2 = 'de'
                        $scope.screen = "main"
                        loadVoices();

                        $scope.setWords($scope.words)
                        console.log("set words  >\n",$scope.getWords());
                        
                        userFile.currentFilename = "_words_en_-_de"
                        $scope.currentFilename = userFile.currentFilename

                        saveLocSto(userFile.currentFilename,
                                $scope.lang1, $scope.lang2,$scope.words)
                        loadLocalStorage()

                        // to hide open file / copy-paste div on initial screen
                        $scope.chooseNew = false
                })
                
            }

            $scope.screenChange = function(screen){

                        console.log('to screen', screen)

                        // if returning from test early
                        if (screen ==='test') {
                                screen = 'main'
                                $scope.finalResult = 0;
                                $scope.$parent.$broadcast('endOfTest')
                        }
                        $timeout(function(){
                                $scope.screen = screen;        
                        })

                        //if (screen ==='test') $scope.$parent.$broadcast('testScreen')
            }
            


            $scope.onSelect = function(ev){
                
                        console.log('ev', ev)
            }

            $scope.parseText = vocabfile.parseText
            //$scope.storedDicts = []
            $scope.loadDictWay = ""

            

            $scope.mainScreen = true

            $scope.slct = [],  
            $scope.p1


            // voice business

            $scope.voice1On = true
            $scope.voice2On = true
            $scope.defaultVoice1 = null
            $scope.defaultVoice2 = null
            $scope.voice1Switch = function(){
                        $timeout(function(){
                                $scope.voice1On = !$scope.voice1On

            })}
            $scope.voice2Switch = function(){
                                //console.log('now voice2', $scope.voice2On )
                        $timeout(function(){
                                $scope.voice2On = !$scope.voice2On
                                console.log('now voice2', $scope.voice2On )
            })}
            $scope.voice1Select = function(v){
                
                                console.log("v", v)
                                $timeout(function(){
                                        $scope.voice1 = getVoiceIndex(v)
                                        console.log("new voice1\n\n",v, $scope.voice1)
                                })                                
            }
            $scope.voice2Select = function(v){

                                console.log("v", v)
                                $timeout(function(){
                                        $scope.voice2 = getVoiceIndex(v)
                                        console.log("new voice2\n\n",v, $scope.voice2)
                                        //alert($scope.voice2 + " " + $scope.voices[$scope.voice2].name)
                                })
            }
            function getVoiceIndex(name){

                        return $scope.voices.findIndex(function(voice){
                                        //console.log(i, name, voice.name)

                                        return name === voice.name
                                })
                        
            }

            

            $scope.direction = 'ab',
                //$scope.lang1 = 'cz', 
                //$scope.lang2 = 'de'
            $scope.dir = testShare.direction
            $scope.showWords = false

            $scope.zen = false

            $scope.lengths = [1,3,5,10,15,20,30,40,50]
            $scope.defaultLength = $scope.lengths[1]
            $scope.testLength = $scope.lengths[1]

            $scope.testTypes = ['repeat previous','checked ones','newest','all words','unknown']
            $scope.selectedType = $scope.testTypes[2]
            $scope.prevType = $scope.testTypes[2]

            //$scope.testType = $scope.selectedType
            //console.log('$scope.selectedType', $scope.selectedType)

            $scope.updateWord = testShare.updateWord
            $scope.prepareExam = exam.prepareExam
            //$scope.previousTest = []
            

            $scope.getWords = testShare.getWords
            $scope.setWords = testShare.setWords
            $scope.setPrevTest = testShare.setPrevTest 
            $scope.getPrevTest = testShare.getPrevTest 

                $scope.wAscen = true    
                $scope.$watch('wAscen', function(){

                                //alert('ascen')
                })
                $scope.example = [
                        {fr:'ahoj',   to:'hallo', lev: 4},
                        {fr:'neděle', to:'sontag',lev:2},
                        {fr:'já',     to:'ich',   lev:5},
                        {fr:'nůž',    to: 'Messer',lev:3},
                        {fr:'ostře',  to:'scharf'},
                        {fr:'salát',  to:'Salat',lev:3},
                        {fr:'sladký', to:'süß'},
                        {fr:'kyselý', to:'sauer',lev:6}
                ]

                $scope.example2 = [
                        ['hi','hallo',1],
                        ['sunday','sontag',2],
                        ['já','ich',1],
                        ['nůž', 'Messer',0],
                        ['ostře', 'scharf'],
                        ['salát', 'Salat',3],
                        ['sladký', 'süß'],
                        ['kyselý', 'sauer',6],
                        ['poledne', 'mittag'],
                        ['slaný', 'salzig',4],
                        ['snídaně', 'Frühstück',5],
                        ['džem', 'Marmelade'],
                        ['jak', 'wie']
                        ]
                //$scope.words = ["a","b","c"] //$scope.example

                $scope.lastGroup = function(index){

                        // return true to show only last group  $index - wo.length
                        // return false to show all previous

                        let len= $scope.words.length

                        return index === Math.floor(len/10) * 10 //&& index % 10 === 0

                }


                
                function dateIt(){
                        
                                let d = new Date()
                        
                                let month = d.getMonth()+1
                                switch(month){
                                        case 1: month = 'Jan'; break;
                                        case 2: month = 'Feb'; break;
                                        case 3: month = 'Mar'; break;
                                        case 4: month = 'Apr'; break;
                                        case 5: month = 'May'; break;
                                        case 6: month = 'Jun'; break;
                                        case 7: month = 'Jul'; break;
                                        case 8: month = 'Aug'; break;
                                        case 9: month = 'Sep'; break;
                                        case 10: month = 'Oct'; break;
                                        case 11: month = 'Nov'; break;
                                        case 12: month = 'Dec'; break;
                                }
                                let min = d.getMinutes()
                                if (min.toString().length === 1) min = '0' + min.toString()
        
                                let final = d.getDate() + " " + month + " " + d.getFullYear() + "  " + d.getHours() + ":" + min
        
                                console.log(final)
                                return final
                        }
                $scope.zenSwitch = function(){
                        console.log('zenSwitched')
                        $timeout(function(){
                                $scope.zen = !$scope.zen
                                $scope.$parent.$broadcast('zenSwitch', $scope.zen)
                                console.log("scope1.zen", $scope.zen)
                        })
                        
                }
                $scope.showVocab = function(show){
                        
                        //if ($scope.screen === "words") $scope.screen = "main"
                        //else if ($scope.screen ==="main") $scope.screen = "words"
                        
                        //$parent.
                        $scope.$broadcast('screen', 'words')
                        
                        $timeout(function(){
                                $scope.showWords = !$scope.showWords
                                if (show) $scope.screen = "words"
                                else if (!show) {
                                        $scope.screen = "main"
                                        $scope.showUserNotes = false;
                                }
        
                                
                                console.log("screen", $scope.screen)
                                
                        })
                        //$scope.$apply(function(){})
                        
                }
                $scope.$on('screen', function(e,d){
                        //console.log("event, data", e, d)
                        $timeout(function(){
                                //$scope.screen = d
                        },100)
                        
                })

                $scope.al = true
                $scope.sorter = this.lev
                $scope.reverse = function(){
                        $scope.wAscen = !$scope.wAscen
                        console.log('$scope.wAscen', $scope.wAscen)
                }

                $scope.changeDir = function changeDir(){
                        let helper = $scope.lang1
                        $scope.lang1 = $scope.lang2
                        $scope.lang2 = helper

                        if ($scope.direction ==='ab') $scope.direction = 'ba'
                        else if ($scope.direction ==='ba') $scope.direction = 'ab'

                        $scope.$parent.$broadcast('dirChange',$scope.direction)
                }
                // test type selection
                $scope.typeSelection = function(type){
                        $timeout(function(){
                                $scope.prevType = $scope.selectedType
                                //$scope.testType
                                $scope.selectedType = type

                        })
                }
                
                $scope.shared = testShare.testQuestions
                $scope.setTest = testShare.setVal

                setInterval(function(){
                        //console.log($scope.screen)
                },2000)

                //  main button
                $scope.practice = function practice(){
                        
                        $scope.showWords = false
                        

                        new Promise(function(resolve,rej){
                                let rslt = $scope.prepareExam($scope.selectedType, $scope.testLength, $scope.words)
                                $scope.setPrevTest(rslt)

                                resolve(rslt)
                        })
                        .then(function(test){
                                console.log('- - - - - - - - - - - - - -')
                                console.log('new test questions arrived')
                                console.log(test)
                                
                                

                                let voiceToSend = {
                                                // defaultVoice1Index
                                                v1on: $scope.voice1On,
                                                v2on: $scope.voice2On,
                                                v1: ($scope.voice1) ? $scope.voice1 : $scope.defaultVoiceIndexes[0],
                                                v2: ($scope.voice2) ? $scope.voice2 : $scope.defaultVoiceIndexes[1]
                                }
                                console.log('voiceToSend', voiceToSend)
                                //alert(JSON.stringify(voiceToSend))

                                


                                //console.log('$scope.screen', $scope.screen)
                                //$scope.$apply()
                                $timeout(function(){
                                        $scope.screen = "test"
                                        $scope.shared = test
                                        $scope.setTest(test)
                                        $scope.mainScreen = false
                                })
                                $rootScope//.$parent
                                .$broadcast('newTest', voiceToSend)
                                        
                                        //testShare.testQuestions
                                        //testShare.testQuestions = test
                                        //console.log('$scope.shared')
                                        //console.log(testShare.testQuestions)

                        })
                }
                $scope.$on('endOfTest', function(){

                        console.log('end of test main ctrl')                        
                        //$scope.$apply()
                        $timeout(function(){
                                $scope.mainScreen = true
                                $scope.screen = "main"

                                
                        })

                        saveLocSto(userFile.currentFilename,
                                        $scope.lang1, $scope.lang2,
                                        $scope.words)
                        console.log("to save into local storage\n", userFile, $scope.lang1, $scope.lang2)
                        //console.log($scope.words)
                })


                $scope.$on('updateWord', function(ev,data){
                        console.log('broadcast')
                        console.log(ev, data)

                        $scope.updateWord(data.ind, data.word)
                })
                


                $scope.lengthSelect = function(x){
                        console.log('length',x)
                        //$scope.prepareExam($scope.words, x)
                        $scope.testLength = x
                }

                $scope.change = function(id,sectionMark){
                        
                        console.log('check change', sectionMark,". id", id)
                        

                        if (!sectionMark){

                                //console.log('id',id)
                                if ($scope.slct.indexOf(id)===-1) {

                                        $timeout(function(){
                                                $scope.slct.push(id)
                                        })
                                        


                                } else {
                                        console.log('||||| remove')

                                        $timeout(function(){
                                                $scope.slct.splice($scope.slct.indexOf(id),1 )
                                        })
                                }

                        } else {
                                console.log('group selection:', id, id+10)
                                console.log('sclt', $scope.slct)

                                // find if all positions indicated have words
                                
                                // is froup one checked?
                                // if yes, then uncheck all even itself

                                if ($scope.slct.indexOf(id)>-1){

                                        console.log('group', id,"-",id+10,"is checked ==> UNCHECK em" )
                                        //  ==> uncheck em all

                                        for (let i=id; i<id+10; i++){
                                                if ($scope.words[i]!== undefined){

                                                        //if ($scope.slct.indexOf(i)===-1) 
                                                        //$timeout(function(){
                                                        //        $scope.slct.push(i)
                                                        //})

                                                        //else 
                                                $timeout(function(){

                                                        $scope.slct.splice($scope.slct.indexOf(i),1 )
                                                        $scope.selectedType = $scope.prevType
                                                })
                                                }
                                        }
                                } else {
                                        console.log('group', id,"-",id+10,"NOT checked ==> check em" )

                                        for (let i=id; i<id+10; i++){
                                                if ($scope.words[i]!== undefined){

                                                        $timeout(function(){
                                                                $scope.slct.push(i)
                                                                $scope.selectedType = 'checked ones'
                                                        })

                                                }

                                        }

                                }


                                /*for (let i=id; i<id+10; i++){

                                        if ($scope.words[i]!== undefined){

                                                if ($scope.slct.indexOf(i)===-1) 
                                                $timeout(function(){
                                                        $scope.slct.push(i)
                                                })

                                                else $timeout(function(){

                                                $scope.slct.splice($scope.slct.indexOf(i),1 )
                                                })
                                        }
                                }*/
                        }
                        
                        $scope.$parent.$broadcast('slct')
    
                }
                $scope.picked = function picked(x){


                        

                        let res = $scope.slct.findIndex(function(item){

                                                return item === x
                                  })
                        //console.log('hi colors',x , res)

                        if (res > -1) return true
                        else return false
                }
                $scope.$on('checkBoxChange', function(ev, data){

                })
                $scope.allchecked = function(from){
                        let till

                        //console.log('all check' + from," : ", till, " .")

                        
                        // find if there are all posible cheboxes/ words
                        for (let i=from; i<from+10; i++){
                                if ($scope.words[i]=== undefined) {
                                        till = i-1
                                        break
                                }
                        }
                        if (!till) till = from + 10

                        //console.log("till", till)

                        let allChecked = true;

                        for (let i=from; i <= till; i++){
                                if ($scope.slct.indexOf(i) === -1) { allChecked = false; break
                                }
                        }

                        //$scope.$timeout(function(){
                                return allChecked
                        //},)
                        
                }
                $scope.submit = function(){
                        console.log('subm')
                        
                        $scope.xx = teacherService.makeTest($scope.words, $scope.slct)
                    
                }
                
                $scope.downloadDict = exam.downloadDict
                //$scope.shared = exam.shared
                //$scope.shared = testShare.shrd
                //console.log($scope.shared)

        }])
.controller('testCtrl',['$scope','$rootScope','$timeout', 'exam','testShare',
                function($scope,$rootScope, $timeout,exam,testShare){
        
        
        if (window.speechSynthesis) {
                $scope.synth = window.speechSynthesis;
                $scope.voices = []

                $timeout(function(){
                        $scope.voices = $scope.synth.getVoices();    
                },1000)
        }

        $scope.zen = false, $scope.showTest = false
        
        $scope.dir = testShare.direction
        $scope.direction = 'ab'
        $scope.from = 0; $scope.to = 1

        $timeout(function(){
                //console.log('------ check - - ----- ')
        },1000)
        $scope.timeout = $timeout

        $scope.anim_Bads = 'anim-bad', $scope.anim_Oks = 'anim-ok'

        $scope.oks = 0, $scope.bads = 0, $scope.feedback = []
        //$scope.testQuestions = testShare.testQuestions
        $scope.getQuestions = testShare.getVal
        $scope.testQuestions = "", $scope.answerHide = true
        $scope.inpVal = "", $scope.user = {}

        $scope.newRound = exam.newRound
        $scope.submit = exam.submit

        $scope.next = exam.next, $scope.nextGo = 'go',
        $scope.home = home


        $scope.$on('dirChange', function(ev,string){
                $scope.direction = string
                console.log('ctrl2 dir:',$scope.direction)

                if ($scope.direction ==='ab') { 
                                        $scope.from = 0; $scope.to = 1
                } else if ($scope.direction === 'ba'){
                                        $scope.from = 1; $scope.to = 0
                }
        })
        $scope.$on('zenSwitch', function(ev,data){
                $timeout(function(){
                        $scope.zen = data

                        console.log('$scope.zen',$scope.zen)
                })
                

        })
        $scope.$on('testScreen', function(){
                        console.log('test screen on')
                        //$scope.screen = 'test'
                        //$scope.$apply()
        })
        $scope.$on('endOfTest', function(){
                console.log('endoftest')
                $scope.screen = ''    
                $scope.blur = false; 
                                   
        })
        //console.log($scope)
        //console.log("\n\n\nlistener count", $scope.$$listenerCount['newTest']) 
        //if ($scope.$$listenerCount['newTest']===2) $scope.$$listenerCount['newTest']=1

        //let newTestCounter = 0
        $scope.$on('newTest',function(ev, voiceData){
                //newTestCounter++
                //console.log('newTestCounter', newTestCounter)
                console.log("\n\n\nlistener count", $scope.$$listenerCount['newTest']) 
                //if ($scope.$$listenerCount['newTest']>1) {
                //        $scope.$$listenerCount['newTest']=1
                //}
                        console.log('--------------------------------------')

                        if (window.speechSynthesis){
                                $timeout(function(){
                                        $scope.voice1On = voiceData.v1on
                                        $scope.voice2On = voiceData.v2on
                                        $scope.voice1 = $scope.voices[voiceData.v1]
                                        $scope.voice2 = $scope.voices[voiceData.v2]
                                })
                                
                        }
                        

                        console.log("speeches: \n", $scope.voice1On, $scope.voice2On, 
                                        $scope.voice1, $scope.voice2)

                        

                        $timeout(function(){
                                //console.log('localWords', $scope.localWords)
                                $scope.localWords = $scope.getWords()


                                $scope.oks = 0, $scope.bads = 0, $scope.feedback = []
                                $scope.round = 0
                                $scope.addRound = false
                
                                //$scope.blur = true
                                $scope.changeNextGo('go')
                                $scope.finalResult = 0

                                $scope.screen = 'test'
                                $scope.showTest = true

                                $scope.testQuestions = $scope.getQuestions()
                                //console.log('$scope.testQuestions', $scope.testQuestions) //[$scope.round]
                                console.log('$scope.testQuestions', $scope.testQuestions[$scope.round])

                                $scope.currIndex = $scope.testQuestions[$scope.round].ind

                                console.log($scope.round+1, " vs ", $scope.testQuestions.length)
                                
                                $scope.newRound('first')
                        })
                        
                        console.log('|||||    zen? ',$scope.zen)

                //}

                


                
                
                //alert(JSON.stringify(data))
                
                //console.log('|||||||||| scope 2:')
                //console.log('dir',$scope.direction)
                
                //$scope.$apply()
                //  
                
                //console.log('$scope.currIndex',$scope.currIndex)
                //$scope.curr = $scope.testQuestions
                

                //console.log("---round now1>>>", $scope.round)
                /*setTimeout(function(){
                        console.log("---round now2>>> ", $scope.round)
                },10000)*/
        })
        
        $scope.changeNextGo = exam.changeNextGo
        $scope.getNextGo = exam.getNextGo

        $timeout(function(){
                    //console.log("||||||||||||",$scope.changeNextGo,"<<<")
        },2000)
        
        //new Promise(
        $scope.endCheck = function(/*resolve, reject*/ cb ){


                console.log($scope.round, " vs ", $scope.testQuestions.length-1)

                if ($scope.round === $scope.testQuestions.length-1){
                                
                                //alert('end test - ')
                                //$scope.$parent.$broadcast('endOfTest')
                                cb(true)

                } else cb(false)

        }//)
        $scope.changeLevel = changeLevel
        $scope.updateWord = testShare.updateWord
        $scope.getWords = testShare.getWords
        //console.log('$scope.getWords', $scope.getWords)
        //var t = setInterval(function(){

                //        $scope.testQuestions = $scope.getQuestions()
                //        console.log(bbb)//$scope.testQuestions)
                //},1000)
                //$scope.shared = exam.shared
                //$scope.shared = testShare.shrd
}])



/*function startTest(){
        console.log(' ---- -  test started - ---- ')
}*/