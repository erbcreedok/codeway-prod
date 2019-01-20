<?php
require_once('PHPMailer/class.phpmailer.php');

$mail = new PHPMailer;

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'mail.codeway.kz';                     // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'mail@codeway.kz';                 // SMTP username
$mail->Password = 'Codew@y123';                           // SMTP password
$mail->SMTPSecure = 'no';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 25;                                    // TCP port to connect to

$mail->From = 'info@carmaster.kz';
$mail->FromName = 'CODEWAY';
$mail->addAddress('codeway.kz@gmail.com', 'a');     // Add a recipient
$mail->addReplyTo('codeway.kz@gmail.com', 'a');
$mail->CharSet = 'UTF-8';

$mail->isHTML(true);                                  // Set email format to HTML
$subject = $_GET['subject'];
$message = $_GET['message'];

file_put_contents("./sendtg.php?message=$message");

$mail->Subject = $subject;
$mail->Body    = $message;
$mail->AltBody = $message;

if (!$mail->send()) {
    echo 'error';
} else {
    echo 'success';
};
?>