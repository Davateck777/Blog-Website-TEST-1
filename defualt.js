function upload() {
  //get  image
  var image = document.getElementById("image").files[0];
  //get  blog text
  var post = document.getElementById("post").value;
  //get image name
  var imageName = image.name;
  //firebase storage reference
  //it is the path where your image will be stored
  var uniquePath = "image/" + new Date().getTime() + "_" + imageName;
  var storageRef = firebase.storage().ref(uniquePath);

  var uploadTask = storageRef.put(image);
  //to get the state of image uploading....
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("upload is " + progress + " done");
    },
    function (error) {
      //handle error here
      console.log(error.message);
    },
    function () {
      //handle successfull upload here..
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //get your image download url here and upload it to databse
        firebase
          .database()
          .ref("blogs/")
          .push()
          .set(
            {
              text: post,
              imageURL: downloadURL,
            },
            function (error) {
              if (error) {
                alert("Error while uploading");
              } else {
                alert("Successfully uploaded");
                //now reset form
                document.getElementById("post-form").reset();
                getdata();
              }
            }
          );
      });
    }
  );
}

window.onload = function () {
  this.getdata();
};

function getdata() {
  firebase
    .database()
    .ref("blogs/")
    .once("value")
    .then(function (snapshot) {
      let posts_div = document.getElementById("posts");
      //remove all remaining data in that div
      posts.innerHTML = "";
      data = snapshot.val();
      let data = snapshot.val();
      //now pass this data to our posts div

      for (let [key, value] of Object.entries(data)) {
        posts_div.innerHTML =
          "<div class='col-sm-4 mt-2 mb-1'>" +
          "<div class='card'>" +
          "<img src='" +
          value.imageURL +
          "' style='height:250px;'>" +
          "<div class='card-body'><p class='card-text'>" +
          value.text +
          "</p>" +
          "<button class='btn btn-danger' id='"+key+"' onclick='delete_post(this.id)"+
          "</div></div></div>" +
          posts_div.innerHTML;
      }
    });
}

function delete_post(key) {
  firebase
    .database()
    .ref("blogs/" + key)
    .remove();
  getdata();
}
