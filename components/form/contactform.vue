<template>
    <div class="cf-row w-100">
        <div class="map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.547253441953!2d67.05644471407878!3d24.87930818404503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33eed7e8b02fd%3A0x8a8508f94fe2d8d7!2s166th%20St%2C%20Pakistan%20Employees%20Co-Operative%20Housing%20Society%20Block%203%20PECHS%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1623754004588!5m2!1sen!2s" width="600px" height="450px"></iframe>
        </div>
        <div class="contact-form">
                <h2 class="form-heading">Get In Touch!</h2>
                <b-form class="w-100">
                    <b-form-row class="d-flex w-100 ml-0 mr-0">
                        <b-col class="form-col mr-3 mb-3 p-0">
                            <label for="name">Name</label>
                            <b-form-input type="text" id="name"></b-form-input>
                        </b-col>
                        <b-col class="form-col mb-3 p-0">
                            <label for="phone-number">Phone Number</label>
                            <b-form-input type="email" id="phone-number"></b-form-input>
                        </b-col>
                    </b-form-row>
                    <label for="name">Email Address</label>
                    <b-form-input type="email" class="mb-3 w-100" id="name"></b-form-input>

                    <label for="name">Comment</label>
                    <b-form-textarea class="mb-3 mr-sm-2 w-100 comment-field" id="comment"></b-form-textarea>

                    <div class="submit-btn-wrap mt-3">
                    <b-button class="submit-btn">
                        Submit
                    </b-button>
                    </div>
                </b-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .cf-row {
        display: flex;
        justify-content: flex-end;
        @media (max-width:767px) {
            display: block;
        }
    }

    .map {
        width: 45%;
        position: absolute;
        left: 0;
        @media (max-width:767px) {
            width: 100%;
            position: relative;
        }
        iframe {
            width: 100%;
            height: 629px;
            border: none;
            @media (max-width:767px) {
                height: 100%;
            }
        }
    }
    .contact-form {
        width: 55%;
        padding: 42px 30px;
        @media (max-width:767px) {
            width: 100%;
            padding-top: 20px;
        }
        @media (max-width:500px) {
            padding-left: 15px;
            padding-right: 15px;
        }
        .form-heading {
            font-size: 3vw;
            font-weight: 800;
            color: #000;
            padding-bottom: 10px;
            line-height: 59px;
            @media (max-width:767px) {
                font-size: 20px;
                line-height: 25px;
            }
        }
        form {
            .form-row {
                flex-wrap: nowrap;
                @media (max-width:500px) {
                    flex-wrap: wrap;
                    display: block !important;
                }
                .form-col {
                    width: 25vw;
                    @media (max-width:767px) {
                        width: 42.6vw;
                    }
                    @media (max-width:500px) {
                        width: 100%;
                        margin-right: 0 !important;
                    }
                }
            }
            label {
                font-size: 16px;
                color: #000;
                font-weight: bold;
                @media (max-width:767px) {
                    font-size: 14px;
                }
            }
            input {
                border: 1px solid rgba(38, 57, 87, 0.2);
                border-radius: 5px;
            }
            .submit-btn-wrap {
                text-align: right;
                .submit-btn {
                    background-color: #0C56C9;
                    border: none;
                    color: white;
                    font-size: 18px;
                    height: 49px;
                    width: 142px;
                    font-weight: bold;
                    text-align: center;
                    border-radius: 5px;
                    &:focus {box-shadow: none;}
                }
            }
            .comment-field {
                height: 178px;
                resize: none;
            }
        }
    }
</style>