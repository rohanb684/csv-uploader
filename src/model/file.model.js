export default  class FileModel {
    constructor(name, filename){
        this.name =  name;
        this.filename = filename;
    }

    static add(file){
        files.push(file)
        return files;
    }

    static getFiles(){
        return files;
    }

    static isCSV(filename) {
        return filename.endsWith('.csv'); 
    }
}


var files = [

]