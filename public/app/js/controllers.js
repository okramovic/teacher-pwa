app
.controller('teacherCtr',['$scope','$rootScope','$timeout',
               '$window', // used for local storage access (saving dicts & progress)
               'exam', 'vocabfile', 'testShare','voiceLoader',
          function($scope, $rootScope, $timeout, $window, exam,vocabfile, testShare,voiceLoader){

               //$scope.storedDicts = [] //$scope.p1



               // functions shared from Services
                    $scope.autoChooseVoices = voiceLoader.autoChooseVoices

                    $scope.downloadDict = exam.downloadDict
                    $scope.prepareExam = exam.prepareExam
               
                    $scope.getWords = testShare.getWords
                    $scope.setWords = testShare.setWords
                    $scope.setPrevTest = testShare.setPrevTest
                    $scope.getPrevTest = testShare.getPrevTest

                    $scope.parseText = vocabfile.parseText
               //


                    $scope.$timeout = $timeout    // needed in Services to update view with new values

               

               
               // loading and saving words

                    const userFile = {}
                    // to hide 'open file' / 'copy-paste' div on initial screen
                    $scope.chooseNew = false

                    // on initial screen: to show/hide divs 
                    //        associated with way to load new Dict
                    $scope.loadDictWay = ""
                    $scope.example2 = [
                         ['Hi','hallo',1],
                         ['Sunday','der Sonntag',2],
                         ['I, me','ich',1],
                         ['Knife', 'der Messer',0],
                         ['Sharp', 'scharf',0],
                         ['Salad', 'der Salat',3],
                         ['Sweet', 'süss'],
                         ['Sour', 'sauer',6],
                         ['Salty', 'salzig',4],
                         ['Midday, noon', 'der Mittag'],
                         ['Breakfast', 'das Frühstück',5],
                         ['Marmelade', 'die Marmelade'],
                         ['How', 'wie'],
                         ["That's why, therefore", 'deshalb'],
                         ['Because of that', 'deswegen'],
                         ['Thereby','dadurch'],
                         ['After that, thereon','darauf'],
                         ['At least','wenigstens'],
                         ['Meadow','die Weise'],
                         ['Support','fördern'],
                         ['For this, in return','dafür'],
                         ['Despite','trotzdem']
                    ]

                    $scope.loadExample = function(){ 
                         userFile.currentFilename = "_words_en_-_de"

                         $timeout(function(){
                              $scope.words = $scope.example2
                              $scope.lang1 = 'en'
                              $scope.lang2 = 'de'
                              $scope.screen = "main"

                              $scope.setWords($scope.words)
                              
                              $scope.currentFilename = userFile.currentFilename

                              $scope.autoChooseVoices()

                              // to hide open file / copy-paste div on initial screen
                              $scope.chooseNew = false
                         })

                         saveLocSto(userFile.currentFilename, 'en', 'de',$scope.example2)
                         loadLocalStorage()
                         
                    }
                    
                    $scope.hasLocalStorage = function(){

                         // get all previously used vocab names (storage filenames)
                         // to let user choose which last session to open

                         let fns = $window.localStorage.getItem("userFileNames")
                         
                         return  fns !== null && fns !== undefined
                    }
                    
                    loadLocalStorage()
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

                    $scope.loadLSDict = function(dict){
                              "use strict"

                              //console.log("dict to load", dict)

                              userFile.currentFilename = dict.toString()
                              

                              let data = angular.fromJson( $window.localStorage.getItem(dict) )
                              let langs = data[0]

                              // remove langs from dict. data
                              data.splice(0,1)
                              data = data.map(function(item) {

                                                       item[0] = item[0].trim()
                                                       item[1] = item[1].trim()
                                                       if (item[2]) item[2] = parseInt(item[2])

                                                       return item
                                                       }
                              );
                              

                              $timeout(function(){
                                        $scope.lang1 = langs[0]; $scope.lang2 = langs[1]
                                        $scope.words = data
                                        $scope.currentFilename = userFile.currentFilename

                                        $scope.mainScreen = true
                                        $scope.screen = "main"

                                        $scope.setWords(data.slice(1))

                                        $scope.autoChooseVoices()
                                        
                              })
                    }

                    function saveLocSto(newName, lang1,lang2, save){
                         "use strict"

                         if (newName && lang1 && lang2 && Array.isArray(save) && save.length>0){
                              console.log(" can save, have all data")

                              newName = newName.toString()

                              let savedFilenames = $window.localStorage.getItem("userFileNames")
                              

                              const dataToSave = mergeToSave([lang1, lang2], save)
                              //console.log('data to save \n\n', toSave)


                              if (!savedFilenames){

                                        //console.log("no stored filenames", savedFilenames)

                                        let names = [  {name: newName, date: dateIt()}  ]
                                        
                                        $window.localStorage.setItem("userFileNames", angular.toJson(names))

                                        $window.localStorage.setItem(
                                                                      newName,
                                                                      angular.toJson( dataToSave )
                                        )

                              // look for newName among stored ones
                              } else if (savedFilenames){

                                        // find whether this filename is already stored
                                        savedFilenames = angular.fromJson(savedFilenames)
                                        let newNameInStorage = false


                                        for (let i=0; i <savedFilenames.length; i++){

                                                  if (savedFilenames[i].name === newName) { 

                                                            newNameInStorage = true;
                                                            break  
                                                  }
                                        }
                                        

                                        if (!newNameInStorage) {

                                                  savedFilenames.push({
                                                                      name: newName,
                                                                      date: dateIt()
                                                                      })

                                                  $window.localStorage.setItem("userFileNames", angular.toJson(savedFilenames))
                                                  
                                                  // new Dict to local storage
                                                  $window.localStorage.setItem( newName,
                                                                                angular.toJson( dataToSave )
                                                                              )

                                                  // to update data on initial screen
                                                  loadLocalStorage()

                                        } else if (newNameInStorage){
                                        
                                                  // save dictionary data
                                                       $window.localStorage.setItem( newName,
                                                                                     angular.toJson( dataToSave )
                                                                                   )
                                                  
                                                  // save date to show on initial screen
                                                       let currentFile = savedFilenames.find(obj=>obj.name==newName)
                                                       currentFile.date = dateIt()
                                                       console.log('updated filenames', savedFilenames)
                                                       $window.localStorage.setItem("userFileNames", angular.toJson(savedFilenames))

                                                  // to update data on initial screen
                                                  loadLocalStorage()
                                        }
                              }
                         }

                    }
                    $scope.deleteLSDict = function(dict, ind){

                              if (confirm("sure to delete?\n\n" + dict)){

                                        let names = angular.fromJson(
                                                  $window.localStorage.getItem("userFileNames")
                                        )
                                        
                                        names.splice(ind, 1)
                                        

                                        console.log("delete index", ind, names)

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

                                        $timeout(()=>{
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
                              //$scope.$broadcast('newDict', parseText(txt))
                              

                              $timeout(function(){
                                                  $scope.words = WORDS//parseText(txt)
                                                  $scope.setWords(WORDS)

                                                  $scope.mainScreen = true
                                                  $scope.screen = "main"

                                                  // to hide open file / copy-paste div on initial screen
                                                  $scope.chooseNew = false
                                                  
                                                  $scope.autoChooseVoices()
                                                  
                              })

                              saveLocSto(userFile.currentFilename, langs.a, langs.b, WORDS)
                              loadLocalStorage()
                    }


                    // when using fileReader
                    $scope.$on('newDict', function(e,d){
                              "use strict"

                              // get fileName and store it into local storage under key userFileNames

                              const WORDS = d.words

                              // this can be simplified!!

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
                              //console.log(d)


                              //$scope.$apply
                              $timeout(function(){
                                        userFile.currentFilename = d.filename
                                        $scope.currentFilename = userFile.currentFilename
                                        $scope.storedDicts.push(d.filename)
                                        $scope.words = d.words
                                        $scope.lang1 = d.langs.a
                                        $scope.lang2 = d.langs.b
                                        $scope.screen = "main"

                                        $scope.autoChooseVoices()

                                        $scope.setWords(d.words)

                                        // to hide open file / copy-paste div on initial screen
                                        $scope.chooseNew = false

                              })

                              saveLocSto(d.filename,d.langs.a, d.langs.b, WORDS)
                              loadLocalStorage()
                              
                    })

                    // when viewing Dict: to show textArea to add user notes
                    $scope.showUserNotes = false
               //  

               
               // voice business
                    $scope.defaultVoiceIndexes = [null, null]
                    


                    if (window.speechSynthesis){
                         let counter = 0
                         //alert('speech ok')

                         if (window.speechSynthesis.onvoiceschanged=== null)
                              window.speechSynthesis.onvoiceschanged = () => {
                                        counter ++
                                        //alert('onvoiceschanged event')
                                        if (!$scope.voices) // <– this is to prevent reloading of voices all the time
                                                  $timeout(()=>{
                                                  $scope.voices = window.speechSynthesis.getVoices()
                                                  //alert('a: voices: ' + window.speechSynthesis.getVoices().length + '\n scope.v ' + $scope.voices.length )
                                                  console.log('CTRL 1', $scope.voices)

                                                  if (counter===1 && $scope.voices.length===0 ) location.reload() 
                                                  $rootScope.$broadcast('voicesArrived')
                                                  })
                              }; 

                         else $timeout(()=>{
                              //console.log('saf voices check')
                              $scope.voices = window.speechSynthesis.getVoices()
                              $rootScope.$broadcast('voicesArrived')
                              console.log('b: voices: ' + window.speechSynthesis.getVoices().length + 
                                                  '\n scope.v ' + $scope.voices.length )
                         })
                              
                         
                    } else {
                              $scope.voices= null;
                              $scope.v1on= false // $scope.voice1On,
                              $scope.v2on= false // $scope.voice2On,
                    }


                    

                    $scope.voice1On = true
                    $scope.voice2On = true
                    $scope.defaultVoice1 = null
                    $scope.defaultVoice2 = null
                    $scope.voice1Switch = function(){
                              $timeout(function(){
                                        $scope.voice1On = !$scope.voice1On

                    })}
                    $scope.voice2Switch = function(){
                              $timeout(function(){
                                        $scope.voice2On = !$scope.voice2On
                                        //console.log('now voice2', $scope.voice2On )
                    })}
                    $scope.voice1Select = function(v){
                         
                                        //console.log("v", v)
                                        $timeout(function(){
                                                  $scope.voice1 = getVoiceIndex(v)
                                                  console.log("new voice1\n\n",v, $scope.voice1)
                                                  //alert("on? " + $scope.voice1On +" v1 " + $scope.voice1)
                                        })                                
                    }
                    $scope.voice2Select = function(v){

                                        console.log("v", v)
                                        $timeout(function(){
                                                  $scope.voice2 = getVoiceIndex(v)
                                                  console.log("new voice2\n\n",v, $scope.voice2)
                                                  //alert("on2 " + $scope.voice2On +" v2 " + $scope.voice2)
                                        })
                    }
                    function getVoiceIndex(name){
                         
                              return $scope.voices.findIndex(function(voice){
                                        //console.log(i, name, voice.name)

                                        return name === voice.name
                              }) 
                    }
               //
               

               // changing of screens:  initial / main / words / test
                    $scope.mainScreen = true

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
               //


               // test length and test type related variables
                    $scope.lengths = [1,3,5,10,15,20,30,40,50]
                    $scope.defaultLength = $scope.lengths[1]
                    $scope.testLength = $scope.lengths[1]

                    $scope.testTypes = ['repeat previous','checked ones','newest','all words','unknown']
                    $scope.selectedType = $scope.testTypes[2]
                    $scope.prevType = $scope.testTypes[2]
               //
                    


               // switching between fast and proper learning modes
               $scope.zen = true

               $scope.zenSwitch = function(){
                         //console.log('zenSwitched')
                         $timeout(function(){
                                   //$scope.zen = !$scope.zen
                                   $scope.$parent.$broadcast('zenSwitch', $scope.zen)
                                   console.log("scope1.zen", $scope.zen)
                         })  
               }
               

               //$scope.showWords = false
               /*$scope.showVocab = function(show){
                         
                         //$scope.$broadcast('screen', 'words')
                         
                         $timeout(function(){
                                   //$scope.showWords = !$scope.showWords
                                   if (show) $scope.screen = "words"
                                   else if (!show) {
                                             $scope.screen = "main"
                                             $scope.showUserNotes = false;
                                   }
     
                                   console.log("screen", $scope.screen)
                         })
               }*/
               

               
               
               // change test direction e.g.: 'EN to DE' to 'DE to EN'
               $scope.direction = 'ab'
               $scope.changeDir = function changeDir(){
                         $timeout(()=>{
                              let helper = $scope.lang1
                              $scope.lang1 = $scope.lang2
                              $scope.lang2 = helper

                              if ($scope.direction ==='ab') $scope.direction = 'ba'
                              else /*if ($scope.direction ==='ba')*/ $scope.direction = 'ab'

                              $scope.$parent.$broadcast('dirChange',$scope.direction)
                         })
                         
               }

               // test type selection
               $scope.typeSelection = function(type){
                         $timeout(function(){
                                   $scope.prevType = $scope.selectedType
                                   //$scope.testType
                                   $scope.selectedType = type

                         })
               }
                    

               //  main button: PRACTICE (take test)
               $scope.practice = function practice(){
                                   //$scope.showWords = false
                                   
                                   new Promise(function(resolve,rej){
                                             let rslt = $scope.prepareExam($scope.selectedType, $scope.testLength, $scope.words)
                                             $scope.setPrevTest(rslt)

                                             resolve(rslt)
                                   })
                                   .then(function(test){
                                             console.log('- - - - - - - - - - - - - -\nnew test')
                                             
                                             $timeout(function(){
                                                  //$scope.showWords = false
                                                  $scope.screen = "test"
                                                  //$scope.shared = test
                                                  //$scope.setTest(test)
                                                  $scope.mainScreen = false
                                             })
                                             $rootScope//.$parent
                                             .$broadcast('newTest', {
                                                            v1on: $scope.voice1On,
                                                            v2on: $scope.voice2On,
                                                            v1: ($scope.voice1) ? $scope.voice1 : $scope.defaultVoiceIndexes[0],
                                                            v2: ($scope.voice2) ? $scope.voice2 : $scope.defaultVoiceIndexes[1]
                                             })
                                   })
               }
               $scope.$on('endOfTest', function(){

                         // change screen
                         $timeout(function(){
                                   $scope.mainScreen = true
                                   $scope.screen = "main"
                         })

                         // save progress to Local Storage
                              // so languages dont get switched
                              if ($scope.direction=='ab') saveLocSto( userFile.currentFilename,
                                                                      $scope.lang1, $scope.lang2,
                                                                      $scope.words)

                              else saveLocSto( userFile.currentFilename,
                                               $scope.lang2, $scope.lang1,
                                               $scope.words)
                         
                         
                         console.log("to save into local storage\n", userFile.currentFilename, $scope.lang1, $scope.lang2)
               })
               
                    


               $scope.lengthSelect = function(len){
                         console.log('length changed to',len)
                         $scope.testLength = len
               }
               // is this .change being used?
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
                         }
                         
                         $scope.$parent.$broadcast('slct')
               }
               
               // when viewing dict: to see that words are checkbox-chosen, return true
               $scope.slct = []
               $scope.picked = function picked(x){
                         //console.log('picked', x)

                         let res = $scope.slct.findIndex(item=>item === x)

                         if (res > -1) return true
                         else return false
               }

               // when showing Dictionary: to know whether the word group is last
               $scope.lastGroup = function(index){

                              // return true to indicate last group  $index - wo.length
                              // return false to indicate all previous
     
                              let len= $scope.words.length
     
                              return index === Math.floor(len/10) * 10 //&& index % 10 === 0
     
               }

                    
               // to append Date to Local storage dictionary
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

                    //console.log(final)
                    return final
               }

               // not used now - was used when words could be checkbox-chosen separately
               /*$scope.allchecked = function(from){
                         let till
                         
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
                         return allChecked
               }*/
}])
.controller('testCtrl',['$scope','$rootScope','$timeout', 'exam','testShare','voiceLoader',
               function($scope,$rootScope, $timeout,exam,testShare,voiceLoader){

        if (window.speechSynthesis){

                $scope.$on('voicesArrived',()=>{
                        
                        // $scope must have its voices to be able to show them on main screen
                        $scope.voices = window.speechSynthesis.getVoices()                                       
                        console.log('CTRL 2', $scope.voices, 'len',$scope.voices.length)    
                })

        } else $scope.voices = null
        

        $scope.zen = true, $scope.showTest = false
        
        //$scope.dir = testShare.direction
        

        $scope.timeout = $timeout

        $scope.anim_Bads = 'anim-bad', $scope.anim_Oks = 'anim-ok'

        $scope.oks = 0, $scope.bads = 0, $scope.feedback = []
        //$scope.testQuestions = testShare.testQuestions
        //$scope.getQuestions = testShare.getTest
        $scope.getQuestions = testShare.getPrevTest
        $scope.testQuestions = "", 
        
        $scope.answerHide = true
        $scope.inpVal = "", $scope.user = {}

        $scope.newRound = exam.newRound
        $scope.submit = exam.submit

        $scope.next = exam.next, $scope.nextGo = 'go',
        $scope.home = home


          $scope.direction = 'ab'
          $scope.from = 0; $scope.to = 1

          $scope.$on('dirChange', function(ev,string){
                $scope.direction = string
                console.log('ctrl2 new dir:',$scope.direction)

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
          /*$scope.$on('testScreen', function(){
                        console.log('test screen on')
                        //$scope.screen = 'test'
                        //$scope.$apply()
          })*/
          $scope.$on('endOfTest', function(){
                console.log('endoftest')
                $scope.screen = ''    
                $scope.blur = false;           
          })
        
        
          $scope.$on('newTest',function(ev, voiceData){
                                   console.log('--------------------------------------')
                        
               $timeout(function(){
                        //console.log('localWords', $scope.localWords)
                        $scope.feedback = []; $scope.finalResult = 0

                        $scope.localWords = $scope.getWords()

                        console.log("voice settings", voiceData)

                        if (window.speechSynthesis && $scope.voices){
                                        
                                        $scope.voice1On = voiceData.v1on
                                        $scope.voice2On = voiceData.v2on
                                        $scope.voice1 = $scope.voices[voiceData.v1]
                                        $scope.voice2 = $scope.voices[voiceData.v2]
                                        
                                        
                                        console.log("speeches: \n", $scope.voice1On, $scope.voice2On, $scope.voice1, $scope.voice2)
                        } else {
                                        $scope.voice1On = false
                                        $scope.voice2On = false
                        }

                        $scope.oks = 0; $scope.bads = 0; 
                        $scope.round = 0
                        $scope.addRound = false

                        //$scope.blur = true
                        $scope.changeNextGo('go')
                        

                        $scope.screen = 'test'
                        $scope.showTest = true

                        $scope.testQuestions = $scope.getQuestions()

                        console.log('$scope.testQuestions', $scope.testQuestions[$scope.round])

                        $scope.currIndex = $scope.testQuestions[$scope.round].ind
                        
                        //$scope.newRound('first')
                        $scope.newRound()
               })     
          })
        
        $scope.changeNextGo = exam.changeNextGo
        $scope.getNextGo = exam.getNextGo
        
        //new Promise(
        $scope.endCheck = function(/*resolve, reject*/ cb ){

               console.log($scope.round, " vs ", $scope.testQuestions.length-1)

               if ($scope.round === $scope.testQuestions.length-1) cb(true)
               else cb(false)

        }
        $scope.changeLevel = changeLevel
        //$scope.updateWord = testShare.updateWord
        $scope.getWords = testShare.getWords
}])
