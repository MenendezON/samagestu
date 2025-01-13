<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('full_name');
            $table->string('avatar');
            $table->date('date_of_admission');
            $table->string('gender')->default('Masculin');         
            $table->uuid('class_id');
            $table->foreign('class_id')->references('id')->on('classrooms');           
            $table->date('date_of_birth');
            $table->string('place_of_birth');
            $table->integer('discount');
            $table->string('nationality')->default('Senegal') ;
            $table->string('address')->nullable();
            $table->string('city')->default('Dakar');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('previous_school');
            $table->char('blood_group'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
};
