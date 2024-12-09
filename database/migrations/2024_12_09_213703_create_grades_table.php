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
        Schema::create('grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
        $table->uuid('student_id');
        $table->uuid('class_id');
        $table->string('subject');
        $table->float('grade');
        $table->foreign('student_id')->references('id')->on('students');
        $table->foreign('class_id')->references('id')->on('classrooms');
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
        Schema::dropIfExists('grades');
    }
};
