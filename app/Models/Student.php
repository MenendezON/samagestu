<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['full_name', 'avatar', 'matricule', 'admission', 'gender', 'class_id', 'date_of_birth', 'place_of_birth', 'discount', 'nationality', 'address', 'city', 'email', 'phone', 'previous_school', 'blood_group', 'observation'];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = str_replace('-', '', (string) Str::uuid());
            }
        });
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_id', 'id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

}
