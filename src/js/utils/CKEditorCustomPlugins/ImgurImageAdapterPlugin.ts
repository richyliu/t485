import $ from "jquery";

class ImgurImageUploadAdapter {
    readonly ImgurAPIKey: string = "a8912fbda20b147";
    loader: any;
    xhr: JQueryXHR;

    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
                .then(file => new Promise((resolve, reject) => {
                    let formData = new FormData();
                    formData.append("image", file);
                    this.xhr = $.ajax({
                        url:"https://api.imgur.com/3/image",
                        method:"post",
                        data:formData,
                        dataType:"json",
                        contentType: false,
                        processData: false,
                        headers:{
                            "Authorization":"Client-ID " + this.ImgurAPIKey
                        },
                        success:(response) => {
                            resolve({
                                default: response.data.link,
                            });
                        },
                        error: (xhr, status, response) => {
                            console.log(xhr, status, response);

                            reject(response ? (status ? status + " " : "") + response : "Unable to upload file: " + file.name);
                        },


                    })

                }));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

}

function ImgurImageUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {

        return new ImgurImageUploadAdapter(loader);
    };
}
export {ImgurImageUploadAdapter, ImgurImageUploadAdapterPlugin}
export default ImgurImageUploadAdapterPlugin